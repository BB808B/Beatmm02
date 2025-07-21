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

# --- Supabase 客户端 (使用 Service Role Key) ---
# 这给了我们在后端足够的权限去操作数据
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


# --- API 路由 ---

@app.route("/api/auth/register", methods=["POST"])
def register():
    """用户注册 - 使用 Supabase Auth"""
    data = request.get_json()
    phone = data.get("phone")
    password = data.get("password")

    if not phone or not password:
        return jsonify({"error": "手机号和密码不能为空"}), 400

    try:
        # 使用 Supabase 官方方法注册用户
        # 这里的 phone 是为了演示，Supabase Auth 默认使用 email
        # 如果要用 phone，需要在 Supabase 后台开启手机号登录
        # 我们假设使用 email 代替 phone
        email = f"{phone}@example.com" # 临时将手机号转为邮箱格式
        auth_response = supabase.auth.sign_up({
            "email": email,
            "password": password,
        })
        
        # 注册成功后，我们的数据库触发器会自动创建 profile
        return jsonify({"message": "注册成功，请检查您的邮箱进行验证"}), 201

    except Exception as e:
        logger.error(f"注册错误: {e}")
        # 处理 Supabase 返回的特定错误
        if "User already registered" in str(e):
            return jsonify({"error": "该用户已被注册"}), 409
        return jsonify({"error": "服务器内部错误"}), 500


@app.route("/api/auth/login", methods=["POST"])
def login():
    """用户登录 - 使用 Supabase Auth"""
    data = request.get_json()
    phone = data.get("phone")
    password = data.get("password")

    if not phone or not password:
        return jsonify({"error": "手机号和密码不能为空"}), 400
    
    try:
        email = f"{phone}@example.com" # 同样，用邮箱格式登录
        auth_response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })

        # 从返回结果中获取 token 和用户 ID
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
        if "Invalid login credentials" in str(e):
             return jsonify({"error": "手机号或密码错误"}), 401
        return jsonify({"error": "服务器错误"}), 500


# --- 健康检查 ---
@app.route("/")
def index():
    return "BeatMM Pro Backend is running!"

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
