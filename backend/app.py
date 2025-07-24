# backend/app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from supabase import create_client, Client
import logging
from datetime import datetime, timezone
import uuid # 用于生成唯一文件名

# 加载环境变量
load_dotenv()

# 创建Flask应用
app = Flask(__name__)
CORS(app, origins="*") # 在生产环境中应配置为你的前端域名

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- 配置 ---
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

if not all([SUPABASE_URL, SUPABASE_SERVICE_KEY]):
    logger.error("Supabase URL and Service Key must be set in environment variables.")
    # 在实际应用中，这里应该引发异常或退出程序

# --- Supabase 客户端 (使用 Service Role Key) ---
try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
except Exception as e:
    logger.error(f"Failed to create Supabase client: {e}")
    # 同样，这里也应该有更健壮的错误处理

# ##############################################
# ###           您的原有代码，保持不变           ###
# ##############################################

@app.route("/api/auth/register", methods=["POST"])
def register():
    """用户注册 - 支持手机号/用户名/密码注册"""
    # ... (您的代码保持不变) ...
    data = request.get_json()
    phone = data.get("phone")
    password = data.get("password")
    username = data.get("username") # 新增用户名注册

    if not (phone or username) or not password:
        return jsonify({"error": "手机号/用户名和密码不能为空"}), 400

    try:
        # 优先使用手机号注册，如果提供
        if phone:
            auth_response = supabase.auth.sign_up({
                "phone": phone,
                "password": password,
            })
            user_id = auth_response.user.id
            # 注册成功后，在profiles表中创建用户资料
            supabase.table("profiles").insert({"id": user_id, "phone": phone, "username": username, "role": "user"}).execute()
            return jsonify({"message": "注册成功，请检查您的手机进行验证"}), 201
        elif username:
            email = f"{username}@beatmm.pro" # 虚拟邮箱
            auth_response = supabase.auth.sign_up({
                "email": email,
                "password": password,
            })
            user_id = auth_response.user.id
            supabase.table("profiles").insert({"id": user_id, "username": username, "email": email, "role": "user"}).execute()
            return jsonify({"message": "注册成功"}), 201

    except Exception as e:
        logger.error(f"注册错误: {e}")
        error_message = str(e)
        if "User already registered" in error_message or "duplicate key value violates unique constraint" in error_message:
            return jsonify({"error": "该手机号或用户名已被注册"}), 409
        return jsonify({"error": "服务器内部错误"}), 500


@app.route("/api/auth/login", methods=["POST"])
def login():
    """用户登录 - 支持手机号/用户名/密码登录"""
    # ... (您的代码保持不变) ...
    data = request.get_json()
    phone = data.get("phone")
    username = data.get("username")
    password = data.get("password")

    if not (phone or username) or not password:
        return jsonify({"error": "手机号/用户名和密码不能为空"}), 400
    
    try:
        auth_response = None
        if phone:
            auth_response = supabase.auth.sign_in_with_password({
                "phone": phone,
                "password": password
            })
        elif username:
            email = f"{username}@beatmm.pro"
            auth_response = supabase.auth.sign_in_with_password({
                "email": email,
                "password": password
            })

        if not auth_response or not auth_response.session or not auth_response.user:
            return jsonify({"error": "手机号/用户名或密码错误"}), 401

        token = auth_response.session.access_token
        user_id = auth_response.user.id
        
        profile_res = supabase.table("profiles").select("role").eq("id", user_id).single().execute()

        return jsonify({
            "message": "登录成功",
            "token": token,
            "user": {
                "id": user_id,
                "role": profile_res.data.get("role", "user") if profile_res.data else "user"
            }
        })
    except Exception as e:
        logger.error(f"登录错误: {e}")
        error_message = str(e)
        if "Invalid login credentials" in error_message or "AuthApiError" in error_message:
             return jsonify({"error": "手机号/用户名或密码错误"}), 401
        return jsonify({"error": "服务器错误"}), 500


# ##############################################
# ###           新增的音乐上传路由            ###
# ##############################################

@app.route("/api/music/upload", methods=["POST"])
def upload_music():
    """处理音乐上传的请求"""
    try:
        # --- 1. 验证用户身份 (这是关键!) ---
        # 实际应用中，需要从 Authorization header 获取 JWT，然后验证用户
        # 这里我们暂时硬编码一个用户ID和用户名用于测试
        # TODO: 替换为真实的JWT验证逻辑
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            # return jsonify({"error": "Authorization header is missing"}), 401
            pass # 暂时允许
        
        # user = supabase.auth.get_user(auth_header.replace("Bearer ", "")).user
        # if not user:
        #     return jsonify({"error": "Invalid token"}), 401
        
        # 假设我们已经验证了用户
        artist_id = "a1b2c3d4-e5f6-a1b2-c3d4-e5f6a1b2c3d4" # 这是一个示例UUID，你需要替换
        artist_name = "DJ_TestUser"

        # --- 2. 获取表单数据和文件 ---
        if 'audio' not in request.files or 'cover' not in request.files:
            return jsonify({"error": "Audio and cover files are required"}), 400

        audio_file = request.files['audio']
        cover_file = request.files['cover']
        title = request.form.get('title')
        description = request.form.get('description', '')
        price = int(request.form.get('price', 0))

        if not title:
            return jsonify({"error": "Title is required"}), 400

        # --- 3. 上传文件到 Supabase Storage ---
        # 为文件生成唯一名称，避免冲突
        audio_ext = os.path.splitext(audio_file.filename)[1]
        cover_ext = os.path.splitext(cover_file.filename)[1]
        
        audio_filename = f"{artist_id}/{uuid.uuid4()}{audio_ext}"
        cover_filename = f"{artist_id}/{uuid.uuid4()}{cover_ext}"

        # 上传音频
        supabase.storage.from_("tracks").upload(
            file=audio_file.read(), 
            path=audio_filename, 
            file_options={"content-type": audio_file.mimetype}
        )
        
        # 上传封面
        supabase.storage.from_("tracks").upload(
            file=cover_file.read(), 
            path=cover_filename, 
            file_options={"content-type": cover_file.mimetype}
        )

        # --- 4. 将元数据写入数据库 ---
        track_data = {
            "title": title,
            "description": description,
            "price": price,
            "artist_id": artist_id,
            "artist_name": artist_name,
            "audio_path": audio_filename,
            "cover_path": cover_filename
        }
        
        insert_res = supabase.table("tracks").insert(track_data).execute()

        if not insert_res.data:
            # 如果数据库插入失败，应考虑删除已上传的文件（回滚操作）
            # supabase.storage.from_("tracks").remove([audio_filename, cover_filename])
            return jsonify({"error": "Failed to save track metadata"}), 500

        return jsonify({"message": "Track uploaded successfully", "track": insert_res.data[0]}), 201

    except Exception as e:
        logger.error(f"文件上传错误: {e}")
        return jsonify({"error": "An internal server error occurred"}), 500


# --- 健康检查 ---
@app.route("/")
def index():
    return "BeatMM Pro Backend is running!"

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True) # 开启debug模式方便开发
