from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from supabase import create_client, Client
import logging
from datetime import datetime, timezone

# 加载环境变量
load_dotenv()

# 创建Flask应用
app = Flask(__name__)
CORS(app, origins="*")

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- 配置 ---
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY") # 使用 Service Key 进行后端操作

if not all([SUPABASE_URL, SUPABASE_SERVICE_KEY]):
    logger.error("Supabase URL and Service Key must be set in environment variables.")
    # 生产环境中应抛出异常或退出

# --- Supabase 客户端 (使用 Service Role Key) ---
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


# --- API 路由 ---

@app.route("/api/auth/register", methods=["POST"])
def register():
    """用户注册 - 支持手机号/用户名/密码注册"""
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
            # 如果只提供用户名，则需要一个虚拟邮箱或在Supabase后台配置用户名登录
            # 考虑到Supabase Auth默认基于Email/Phone，这里暂时用虚拟Email处理用户名注册
            # 实际部署时，建议在Supabase后台配置自定义用户名字段或使用第三方认证
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
            # 同样，使用虚拟邮箱进行登录
            email = f"{username}@beatmm.pro"
            auth_response = supabase.auth.sign_in_with_password({
                "email": email,
                "password": password
            })

        if not auth_response or not auth_response.session or not auth_response.user:
            return jsonify({"error": "手机号/用户名或密码错误"}), 401

        token = auth_response.session.access_token
        user_id = auth_response.user.id

        # 查询 profiles 表获取角色信息
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


# --- 健康检查 ---
@app.route("/")
def index():
    return "BeatMM Pro Backend is running!"

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)


