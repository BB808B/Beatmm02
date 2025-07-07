from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import bcrypt
from datetime import datetime, timedelta
from jose import JWTError, jwt
import logging

# 加载环境变量
load_dotenv()

# 创建Flask应用
app = Flask(__name__)
CORS(app, origins="*")  # 允许所有来源的跨域请求

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# JWT配置
JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = 24

# 超级管理员配置
SUPER_ADMIN_PHONES = [
    os.getenv('SUPER_ADMIN_PHONE_1', '09787715620'),
    os.getenv('SUPER_ADMIN_PHONE_2', '09424425049')
]
SUPER_ADMIN_PASSWORD = os.getenv('SUPER_ADMIN_PASSWORD', 'black098980')

# 模拟数据存储（生产环境中应使用真实数据库）
mock_users = []
mock_tracks = []
mock_transactions = []

# 工具函数
def hash_password(password: str) -> str:
    """哈希密码"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    """验证密码"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_jwt_token(user_data: dict) -> str:
    """创建JWT令牌"""
    payload = {
        'user_id': user_data['id'],
        'phone': user_data['phone'],
        'role': user_data['role'],
        'exp': datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)

def verify_jwt_token(token: str) -> dict:
    """验证JWT令牌"""
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload
    except JWTError:
        return None

def get_current_user(request):
    """从请求中获取当前用户"""
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    
    token = auth_header.split(' ')[1]
    payload = verify_jwt_token(token)
    if not payload:
        return None
    
    return payload

# API路由

@app.route('/api/health', methods=['GET'])
def health_check():
    """健康检查"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'version': '1.0.0',
        'message': 'Myanmar DJ Platform API is running'
    })

@app.route('/api/auth/register', methods=['POST'])
def register():
    """用户注册"""
    try:
        data = request.get_json()
        phone = data.get('phone')
        password = data.get('password')
        
        if not phone or not password:
            return jsonify({'error': '手机号和密码不能为空'}), 400
        
        # 检查手机号是否已存在
        existing_user = next((u for u in mock_users if u['phone'] == phone), None)
        if existing_user:
            return jsonify({'error': '该手机号已被注册'}), 400
        
        # 创建新用户
        hashed_password = hash_password(password)
        
        # 检查是否为超级管理员
        role = 'super_admin' if phone in SUPER_ADMIN_PHONES else 'user'
        
        user_data = {
            'id': f'user_{len(mock_users) + 1}',
            'phone': phone,
            'password': hashed_password,
            'role': role,
            'balance': 0,
            'is_active': True,
            'is_dj': False,
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat()
        }
        
        mock_users.append(user_data)
        
        token = create_jwt_token(user_data)
        
        return jsonify({
            'message': '注册成功',
            'token': token,
            'user': {
                'id': user_data['id'],
                'phone': user_data['phone'],
                'role': user_data['role'],
                'balance': user_data['balance']
            }
        }), 201
            
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        return jsonify({'error': '服务器内部错误'}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    """用户登录"""
    try:
        data = request.get_json()
        phone = data.get('phone')
        password = data.get('password')
        
        if not phone or not password:
            return jsonify({'error': '手机号和密码不能为空'}), 400
        
        # 查找用户
        user = next((u for u in mock_users if u['phone'] == phone), None)
        
        if not user:
            return jsonify({'error': '用户不存在'}), 404
        
        # 检查用户是否被禁用
        if not user.get('is_active', True):
            return jsonify({'error': '账户已被禁用'}), 403
        
        # 验证密码
        if not verify_password(password, user['password']):
            return jsonify({'error': '密码错误'}), 401
        
        # 创建JWT令牌
        token = create_jwt_token(user)
        
        # 更新最后登录时间
        user['last_login'] = datetime.utcnow().isoformat()
        user['updated_at'] = datetime.utcnow().isoformat()
        
        return jsonify({
            'message': '登录成功',
            'token': token,
            'user': {
                'id': user['id'],
                'phone': user['phone'],
                'role': user['role'],
                'balance': user['balance'],
                'is_dj': user.get('is_dj', False)
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        return jsonify({'error': '服务器内部错误'}), 500

@app.route('/api/music/tracks', methods=['GET'])
def get_tracks():
    """获取音乐列表"""
    try:
        # 返回模拟音乐数据
        sample_tracks = [
            {
                'id': 'track_1',
                'title': 'Vietnamese Drum Beat 1',
                'artist': 'DJ Myanmar',
                'duration': 180,
                'file_url': '/audio/sample1.mp3',
                'cover_url': 'https://via.placeholder.com/300x300/ff6b35/ffffff?text=DJ+1',
                'plays': 15420,
                'likes': 234,
                'genre': 'Electronic',
                'created_at': '2024-01-01T00:00:00Z'
            },
            {
                'id': 'track_2',
                'title': 'Tropical House Mix',
                'artist': 'DJ Yangon',
                'duration': 240,
                'file_url': '/audio/sample2.mp3',
                'cover_url': 'https://via.placeholder.com/300x300/004e89/ffffff?text=DJ+2',
                'plays': 8930,
                'likes': 156,
                'genre': 'House',
                'created_at': '2024-01-02T00:00:00Z'
            }
        ]
        
        return jsonify({
            'tracks': sample_tracks,
            'page': 1,
            'limit': 20,
            'total': len(sample_tracks)
        }), 200
        
    except Exception as e:
        logger.error(f"Get tracks error: {str(e)}")
        return jsonify({'error': '服务器内部错误'}), 500

@app.route('/api/notifications', methods=['GET'])
def get_public_notifications():
    """获取公开通知"""
    try:
        sample_notifications = [
            {
                'id': 'notif_1',
                'title': '欢迎来到缅甸DJ平台',
                'content': '感谢您注册我们的平台！在这里您可以发现最棒的越南鼓DJ音乐。',
                'type': 'general',
                'created_at': datetime.utcnow().isoformat()
            },
            {
                'id': 'notif_2',
                'title': '三天免费试听活动',
                'content': '新用户注册即可享受三天免费试听所有音乐！',
                'type': 'promotion',
                'created_at': datetime.utcnow().isoformat()
            }
        ]
        
        return jsonify({
            'notifications': sample_notifications
        }), 200
        
    except Exception as e:
        logger.error(f"Get notifications error: {str(e)}")
        return jsonify({'error': '服务器内部错误'}), 500

@app.route('/api/ranking/djs', methods=['GET'])
def get_dj_ranking():
    """获取DJ排行榜"""
    try:
        sample_rankings = [
            {
                'id': 'dj_1',
                'name': 'DJ Myanmar',
                'rank': 1,
                'total_plays': 50000,
                'total_likes': 1200,
                'track_count': 15,
                'total_tips': 25000,
                'score': 52200
            },
            {
                'id': 'dj_2',
                'name': 'DJ Yangon',
                'rank': 2,
                'total_plays': 35000,
                'total_likes': 800,
                'track_count': 12,
                'total_tips': 18000,
                'score': 37600
            }
        ]
        
        return jsonify({
            'rankings': sample_rankings
        }), 200
        
    except Exception as e:
        logger.error(f"Get DJ ranking error: {str(e)}")
        return jsonify({'error': '服务器内部错误'}), 500

@app.route('/api/bot/chat', methods=['POST'])
def bot_chat():
    """机器人客服对话"""
    try:
        current_user = get_current_user(request)
        if not current_user:
            return jsonify({'error': '未授权访问'}), 401
        
        data = request.get_json()
        message = data.get('message', '').strip()
        
        if not message:
            return jsonify({'error': '消息不能为空'}), 400
        
        # 简单的机器人回复逻辑
        response = generate_bot_response(message)
        
        return jsonify({
            'response': response
        }), 200
        
    except Exception as e:
        logger.error(f"Bot chat error: {str(e)}")
        return jsonify({'error': '服务器内部错误'}), 500

def generate_bot_response(message: str) -> str:
    """生成机器人回复"""
    message_lower = message.lower()
    
    # 简单的关键词匹配回复
    if any(keyword in message_lower for keyword in ['充值', '付款', '支付']):
        return "您可以通过KPay或KBZ Banking进行充值。请在充值页面上传支付截图，管理员会在24小时内处理您的充值请求。"
    
    elif any(keyword in message_lower for keyword in ['提现', '取款']):
        return "提现需要您在个人中心填写收款账户信息。提现申请提交后，管理员会在1-3个工作日内处理。"
    
    elif any(keyword in message_lower for keyword in ['dj', '认证', '申请']):
        return "要成为认证DJ，请在个人中心提交DJ认证申请。通过认证后，您就可以上传音乐并获得打赏收入。"
    
    elif any(keyword in message_lower for keyword in ['vip', '会员']):
        return "VIP会员可以享受无广告播放、高品质音频等特权。我们提供月度和年度套餐，欢迎购买体验。"
    
    elif any(keyword in message_lower for keyword in ['问题', '帮助', '客服']):
        return "我是平台智能客服，可以帮您解答关于充值、提现、DJ认证、VIP会员等问题。请详细描述您的问题。"
    
    elif any(keyword in message_lower for keyword in ['你好', 'hello', 'hi']):
        return "您好！欢迎来到缅甸DJ平台。我是您的专属客服助手，有什么可以帮助您的吗？"
    
    else:
        return "感谢您的咨询。如果您有具体问题，请联系人工客服或在问题描述中包含关键词如：充值、提现、DJ认证、VIP会员等。"

if __name__ == '__main__':
    # 确保在0.0.0.0上监听，以便外部访问
    app.run(host='0.0.0.0', port=5000, debug=True)

