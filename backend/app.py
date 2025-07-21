from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import bcrypt
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from supabase import create_client, Client
import logging

# 加载环境变量
load_dotenv()

# 创建Flask应用
app = Flask(__name__)
# 允许所有来源的跨域请求
CORS(app, origins="*")

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- 配置 ---
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-default-secret-key-change-it")

if not all([SUPABASE_URL, SUPABASE_KEY]):
    logger.error("Supabase URL and Key must be set in environment variables.")

# --- Supabase 客户端 ---
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# --- 工具函数 (精简和优化) ---
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(password: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))
    except (ValueError, TypeError):
        return False

def create_jwt_token(user_id: str, role: str) -> str:
    payload = {
        "user_id": user_id,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(hours=24),
        "iat": datetime.now(timezone.utc)
    }
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm="HS256")

def get_current_user_from_token(req):
    auth_header = req.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    token = auth_header.split(" ")[1]
    try:
        return jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
    except JWTError:
        return None

# --- API 路由 ---
@app.route("/api/auth/register", methods=["POST"])
def register():
    data = request.get_json()
    phone = data.get("phone")
    password = data.get("password")

    if not phone or not password:
        return jsonify({"error": "手机号和密码不能为空"}), 400

    try:
        # 检查手机号是否已存在
        res = supabase.table("users").select("id").eq("phone", phone).execute()
        if res.data:
            return jsonify({"error": "该手机号已被注册"}), 409

        hashed_password = hash_password(password)
        # 新用户有3天试用期
        trial_end_date = datetime.now(timezone.utc) + timedelta(days=3)

        new_user = {
            "phone": phone,
            "password": hashed_password,
            "trial_end_date": trial_end_date.isoformat()
        }
        
        insert_res = supabase.table("users").insert(new_user).execute()
        if not insert_res.data:
            raise Exception("创建用户失败")

        user = insert_res.data[0]
        return jsonify({"message": f"用户 {user['phone']} 注册成功"}), 201

    except Exception as e:
        logger.error(f"注册错误: {e}")
        return jsonify({"error": "服务器内部错误"}), 500

@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json()
    phone = data.get("phone")
    password = data.get("password")

    if not phone or not password:
        return jsonify({"error": "手机号和密码不能为空"}), 400

    try:
        res = supabase.table("users").select("*").eq("phone", phone).single().execute()
        user = res.data

        if not verify_password(password, user["password"]):
            return jsonify({"error": "密码错误"}), 401

        token = create_jwt_token(user_id=user["id"], role=user["role"])
        
        return jsonify({
            "message": "登录成功",
            "token": token,
            "user": {
                "id": user["id"],
                "phone": user["phone"],
                "role": user["role"]
            }
        })
    except Exception as e:
        logger.error(f"登录错误: {e}")
        return jsonify({"error": "用户不存在或服务器错误"}), 404
        
# --- 健康检查 ---
@app.route("/")
def index():
    return "Backend is running!"

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
