# backend/app.py
import os
import uuid
from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client, Client
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
import mimetypes

# --- 初始化与配置 ---
load_dotenv()  # 加载 .env 文件中的环境变量

app = Flask(__name__)
# 注意：在生产环境中，应该更精确地指定允许的来源，而不是 "*"
CORS(app, resources={r"/api/*": {"origins": "*"}}) 

# 从环境变量中获取 Supabase 配置
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

if not url or not key:
    raise ValueError("Supabase URL and Key must be set in the .env file")

supabase: Client = create_client(url, key)

# --- 配置项 (根据您的情报定制) ---
AUDIO_BUCKET_NAME = "音乐文件"
COVER_ART_BUCKET_NAME = "DJ上传"
ALLOWED_AUDIO_EXTENSIONS = {'mp3', 'wav', 'flac', 'm4a'}
ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}


# --- 辅助函数 ---
def allowed_file(filename, allowed_extensions):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in allowed_extensions

# --- API 端点 ---
@app.route("/")
def hello_world():
    return "<p>BeatMM Pro Backend is running!</p>"

@app.route("/api/upload", methods=["POST"])
def upload_track():
    try:
        # 1. --- 验证和解析表单数据 ---
        # 检查JWT（从请求头中获取用户认证信息）
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing or invalid authorization token"}), 401
        
        token = auth_header.split(" ")[1]
        user_response = supabase.auth.get_user(token)
        user = user_response.user
        if not user:
            return jsonify({"error": "Invalid token, user not found"}), 401
        
        uploader_id = user.id

        # 获取表单字段
        title = request.form.get("title")
        artist = request.form.get("artist")
        genre = request.form.get("genre")
        # 其他字段可以按需添加
        
        if not all([title, artist, genre]):
            return jsonify({"error": "Missing required fields: title, artist, genre"}), 400

        # 2. --- 验证和处理文件 ---
        if 'audioFile' not in request.files or 'coverImage' not in request.files:
            return jsonify({"error": "audioFile and coverImage are required"}), 400

        audio_file = request.files['audioFile']
        cover_file = request.files['coverImage']

        if audio_file.filename == '' or cover_file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        if not (allowed_file(audio_file.filename, ALLOWED_AUDIO_EXTENSIONS) and 
                allowed_file(cover_file.filename, ALLOWED_IMAGE_EXTENSIONS)):
            return jsonify({"error": "Invalid file type"}), 400

        # 3. --- 安全上传到 Supabase Storage (私有桶) ---
        
        # 为文件生成独一无二的路径，避免重名和恶意路径
        audio_ext = audio_file.filename.rsplit('.', 1)[1].lower()
        cover_ext = cover_file.filename.rsplit('.', 1)[1].lower()
        
        # 路径格式: user_id/random_uuid.extension
        audio_path_in_bucket = f"{uploader_id}/{uuid.uuid4()}.{audio_ext}"
        cover_path_in_bucket = f"{uploader_id}/{uuid.uuid4()}.{cover_ext}"

        # 读取文件内容为二进制
        audio_data = audio_file.read()
        cover_data = cover_file.read()

        # 上传音频文件
        supabase.storage.from_(AUDIO_BUCKET_NAME).upload(
            file=audio_data,
            path=audio_path_in_bucket,
            file_options={"content-type": mimetypes.guess_type(audio_file.filename)[0] or 'application/octet-stream'}
        )

        # 上传封面图片
        supabase.storage.from_(COVER_ART_BUCKET_NAME).upload(
            file=cover_data,
            path=cover_path_in_bucket,
            file_options={"content-type": mimetypes.guess_type(cover_file.filename)[0] or 'application/octet-stream'}
        )

        # 4. --- 将元数据写入数据库 '轨道' 表 ---
        # 注意：这里的列名完全匹配您提供的截图
        # `文件网址` 和 `封面网址` 存储的是文件在桶中的路径，而不是公开URL！
        track_data = {
            "标题": title,
            "艺术家": artist,
            "标签": genre.split(','), # 假设标签是逗号分隔的字符串，存为数组
            "类型": genre, # 您可以根据需要定义'类型'和'标签'的区别
            "上传者 ID": uploader_id,
            "文件网址": audio_path_in_bucket, 
            "封面网址": cover_path_in_bucket,
            "处于活动状态": True, # 默认为True
            # 戏剧, 喜欢, 期间 等字段可以由数据库设置默认值(如0)，或在之后更新
        }
        
        insert_response = supabase.table("轨道").insert(track_data).execute()

        # 检查数据库插入是否成功
        if not insert_response.data:
            # 如果数据库插入失败，我们应该尝试删除刚刚上传的文件，以避免产生孤立数据
            # (这是一个更高级的错误处理，暂时简化)
            print("Database insert failed:", insert_response.error)
            return jsonify({"error": "Failed to save track metadata to database"}), 500

        return jsonify({
            "message": "Track uploaded successfully!",
            "data": insert_response.data[0]
        }), 201

    except Exception as e:
        # 捕获所有其他异常，并返回一个通用的服务器错误
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": "An internal server error occurred"}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5001)
