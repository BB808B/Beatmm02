from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import bcrypt
from datetime import datetime, timedelta
from jose import JWTError, jwt
from supabase import create_client, Client
import logging

# 加载环境变量
load_dotenv()

# 创建Flask应用
app = Flask(__name__)
# 允许所有来源的跨域请求，这在开发时很方便
CORS(app, origins="*")

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- 配置 ---
# Supabase 配置
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# JWT (用户登录令牌) 配置
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-super-secret-key-that-you-must-change")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# --- Supabase 客户端 ---
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# --- 工具函数 ---
def hash_password(password: str) -> str:
    """哈希密码"""
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(password: str, hashed: str) -> bool:
    """验证密码"""
    try:
        return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))
    except (ValueError, TypeError):
        return False

def create_jwt_token(user_data: dict) -> str:
    """创建JWT令牌"""
    payload = {
        "user_id": user_data["id"],
        "phone": user_data.get("phone"),
        "role": user_data.get("role", "user"),
        "exp": datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS),
    }
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)

def verify_jwt_token(token: str) -> dict:
    """验证JWT令牌"""
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload
    except JWTError:
        return None

def get_current_user(req):
    """从请求头中获取当前用户信息"""
    auth_header = req.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    token = auth_header.split(" ")[1]
    return verify_jwt_token(token)

def is_user_subscribed(user_id: str) -> bool:
    """检查用户是否是有效订阅者或在试用期内"""
    # 1. 检查有效订阅
    try:
        sub_res = supabase.table("subscriptions").select("id").eq("user_id", user_id).eq("status", "active").single().execute()
        if sub_res.data:
            return True
    except Exception:
        pass # .single() will raise error if no rows, it's ok

    # 2. 检查试用期
    try:
        user_res = supabase.table("users").select("trial_end_date").eq("id", user_id).single().execute()
        if user_res.data and user_res.data.get("trial_end_date"):
            trial_end_date = datetime.fromisoformat(user_res.data["trial_end_date"].replace('Z', '+00:00'))
            if datetime.utcnow().replace(tzinfo=trial_end_date.tzinfo) < trial_end_date:
                return True
    except Exception:
        pass

    return False

# --- API 路由 ---
@app.route("/api/health", methods=["GET"])
def health_check():
    """健康检查接口"""
    return jsonify({"status": "healthy", "timestamp": datetime.utcnow().isoformat()})

@app.route("/api/auth/register", methods=["POST"])
def register():
    """用户注册"""
    data = request.get_json()
    phone = data.get("phone")
    password = data.get("password")

    if not phone or not password:
        return jsonify({"error": "手机号和密码不能为空"}), 400

    try:
        existing_user = supabase.table("users").select("id").eq("phone", phone).execute()
        if existing_user.data:
            return jsonify({"error": "该手机号已被注册"}), 400

        hashed_password = hash_password(password)
        # 新用户有3天试用期
        trial_end_date = (datetime.utcnow() + timedelta(days=3)).isoformat()

        new_user_data = {
            "phone": phone,
            "password": hashed_password,
            "role": "user",
            "trial_end_date": trial_end_date
        }
        
        insert_res = supabase.table("users").insert(new_user_data).execute()

        if not insert_res.data:
            raise Exception("插入用户失败")

        user = insert_res.data[0]
        token = create_jwt_token(user)
        
        return jsonify({
            "message": "注册成功",
            "token": token,
            "user": {
                "id": user["id"],
                "phone": user["phone"],
                "role": user["role"],
                "trial_end_date": user["trial_end_date"]
            }
        }), 201

    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        return jsonify({"error": "服务器内部错误"}), 500

@app.route("/api/auth/login", methods=["POST"])
def login():
    """用户登录"""
    data = request.get_json()
    phone = data.get("phone")
    password = data.get("password")

    if not phone or not password:
        return jsonify({"error": "手机号和密码不能为空"}), 400

    try:
        user_res = supabase.table("users").select("*").eq("phone", phone).single().execute()
        
        user = user_res.data
        if not verify_password(password, user["password"]):
            return jsonify({"error": "密码错误"}), 401
        
        if not user.get("is_active", True):
            return jsonify({"error": "账户已被禁用"}), 403
            
        token = create_jwt_token(user)
        
        # 更新最后登录时间
        supabase.table("users").update({"last_login": datetime.utcnow().isoformat()}).eq("id", user["id"]).execute()
        
        return jsonify({
            "message": "登录成功",
            "token": token,
            "user": {
                "id": user["id"],
                "phone": user["phone"],
                "role": user["role"],
                "trial_end_date": user.get("trial_end_date")
            }
        })

    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        return jsonify({"error": "用户不存在或服务器错误"}), 404

@app.route("/api/music/tracks", methods=["GET"])
def get_tracks():
    """获取音乐列表 (需要认证和订阅)"""
    current_user = get_current_user(request)
    if not current_user:
        return jsonify({"error": "未授权访问"}), 401

    if not is_user_subscribed(current_user["user_id"]):
        return jsonify({"error": "请订阅或开始免费试用以访问完整音乐库"}), 403

    try:
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 20))
        offset = (page - 1) * limit
        
        tracks_res = supabase.table("tracks").select("*").order("created_at", desc=True).range(offset, offset + limit - 1).execute()
        
        return jsonify({"tracks": tracks_res.data})

    except Exception as e:
        logger.error(f"Get tracks error: {str(e)}")
        return jsonify({"error": "获取音乐失败"}), 500

if __name__ == "__main__":
    # 确保在0.0.0.0上监听，以便外部访问
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)), debug=True)
