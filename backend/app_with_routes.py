from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import bcrypt
from datetime import datetime, timedelta
from jose import JWTError, jwt
from supabase import create_client, Client
import logging

# 导入路由蓝图
from admin_routes import admin_bp
from payment_routes import payment_bp

# 加载环境变量
load_dotenv()

# 创建Flask应用
app = Flask(__name__)
CORS(app, origins="*")  # 允许所有来源的跨域请求

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Supabase配置
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_KEY')

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

# 初始化Supabase客户端
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

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

# 注册蓝图
app.register_blueprint(admin_bp)
app.register_blueprint(payment_bp)

# 基础API路由

@app.route('/api/health', methods=['GET'])
def health_check():
    """健康检查"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'version': '1.0.0'
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
        existing_user = supabase.table('users').select('*').eq('phone', phone).execute()
        if existing_user.data:
            return jsonify({'error': '该手机号已被注册'}), 400
        
        # 创建新用户
        hashed_password = hash_password(password)
        
        # 检查是否为超级管理员
        role = 'super_admin' if phone in SUPER_ADMIN_PHONES else 'user'
        
        user_data = {
            'phone': phone,
            'password': hashed_password,
            'role': role,
            'balance': 0,
            'is_active': True,
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat()
        }
        
        result = supabase.table('users').insert(user_data).execute()
        
        if result.data:
            user = result.data[0]
            token = create_jwt_token(user)
            
            return jsonify({
                'message': '注册成功',
                'token': token,
                'user': {
                    'id': user['id'],
                    'phone': user['phone'],
                    'role': user['role'],
                    'balance': user['balance']
                }
            }), 201
        else:
            return jsonify({'error': '注册失败'}), 500
            
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
        user_result = supabase.table('users').select('*').eq('phone', phone).execute()
        
        if not user_result.data:
            return jsonify({'error': '用户不存在'}), 404
        
        user = user_result.data[0]
        
        # 检查用户是否被禁用
        if not user.get('is_active', True):
            return jsonify({'error': '账户已被禁用'}), 403
        
        # 验证密码
        if not verify_password(password, user['password']):
            return jsonify({'error': '密码错误'}), 401
        
        # 创建JWT令牌
        token = create_jwt_token(user)
        
        # 更新最后登录时间
        supabase.table('users').update({
            'last_login': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat()
        }).eq('id', user['id']).execute()
        
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

@app.route('/api/auth/profile', methods=['GET'])
def get_profile():
    """获取用户资料"""
    try:
        current_user = get_current_user(request)
        if not current_user:
            return jsonify({'error': '未授权访问'}), 401
        
        user_result = supabase.table('users').select('*').eq('id', current_user['user_id']).execute()
        
        if not user_result.data:
            return jsonify({'error': '用户不存在'}), 404
        
        user = user_result.data[0]
        
        return jsonify({
            'user': {
                'id': user['id'],
                'phone': user['phone'],
                'role': user['role'],
                'balance': user['balance'],
                'is_dj': user.get('is_dj', False),
                'is_active': user.get('is_active', True),
                'created_at': user['created_at'],
                'last_login': user.get('last_login')
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Profile error: {str(e)}")
        return jsonify({'error': '服务器内部错误'}), 500

@app.route('/api/music/tracks', methods=['GET'])
def get_tracks():
    """获取音乐列表"""
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        search = request.args.get('search', '')
        
        offset = (page - 1) * limit
        
        query = supabase.table('tracks').select('*')
        
        if search:
            query = query.ilike('title', f'%{search}%')
        
        result = query.order('created_at', desc=True).range(offset, offset + limit - 1).execute()
        
        return jsonify({
            'tracks': result.data,
            'page': page,
            'limit': limit,
            'total': len(result.data)
        }), 200
        
    except Exception as e:
        logger.error(f"Get tracks error: {str(e)}")
        return jsonify({'error': '服务器内部错误'}), 500

@app.route('/api/music/upload', methods=['POST'])
def upload_music():
    """上传音乐（仅DJ可用）"""
    try:
        current_user = get_current_user(request)
        if not current_user:
            return jsonify({'error': '未授权访问'}), 401
        
        # 检查用户是否为DJ
        user_result = supabase.table('users').select('*').eq('id', current_user['user_id']).execute()
        user = user_result.data[0] if user_result.data else None
        
        if not user or not user.get('is_dj', False):
            return jsonify({'error': '只有认证DJ才能上传音乐'}), 403
        
        data = request.get_json()
        title = data.get('title')
        artist = data.get('artist', user['phone'])  # 默认使用用户手机号作为艺术家名
        duration = data.get('duration', 0)
        
        if not title:
            return jsonify({'error': '音乐标题不能为空'}), 400
        
        # 创建音乐记录
        track_data = {
            'title': title,
            'artist': artist,
            'duration': duration,
            'uploader_id': current_user['user_id'],
            'plays': 0,
            'likes': 0,
            'is_active': True,
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat()
        }
        
        result = supabase.table('tracks').insert(track_data).execute()
        
        if result.data:
            return jsonify({
                'message': '音乐上传成功',
                'track': result.data[0]
            }), 201
        else:
            return jsonify({'error': '上传失败'}), 500
            
    except Exception as e:
        logger.error(f"Upload music error: {str(e)}")
        return jsonify({'error': '服务器内部错误'}), 500

@app.route('/api/dj/apply', methods=['POST'])
def apply_dj():
    """申请DJ认证"""
    try:
        current_user = get_current_user(request)
        if not current_user:
            return jsonify({'error': '未授权访问'}), 401
        
        data = request.get_json()
        description = data.get('description', '')
        
        # 检查是否已经申请过
        existing_application = supabase.table('dj_applications').select('*').eq('user_id', current_user['user_id']).eq('status', 'pending').execute()
        
        if existing_application.data:
            return jsonify({'error': '您已有待审核的DJ申请'}), 400
        
        # 创建DJ申请记录
        application_data = {
            'user_id': current_user['user_id'],
            'description': description,
            'status': 'pending',
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat()
        }
        
        result = supabase.table('dj_applications').insert(application_data).execute()
        
        if result.data:
            return jsonify({
                'message': 'DJ认证申请提交成功，请等待审核',
                'application': result.data[0]
            }), 201
        else:
            return jsonify({'error': '申请提交失败'}), 500
            
    except Exception as e:
        logger.error(f"DJ application error: {str(e)}")
        return jsonify({'error': '服务器内部错误'}), 500

@app.route('/api/notifications', methods=['GET'])
def get_public_notifications():
    """获取公开通知"""
    try:
        result = supabase.table('notifications').select('*').eq('is_active', True).order('created_at', desc=True).limit(10).execute()
        
        return jsonify({
            'notifications': result.data
        }), 200
        
    except Exception as e:
        logger.error(f"Get notifications error: {str(e)}")
        return jsonify({'error': '服务器内部错误'}), 500

@app.route('/api/ranking/djs', methods=['GET'])
def get_dj_ranking():
    """获取DJ排行榜"""
    try:
        # 获取所有DJ用户及其统计数据
        djs_result = supabase.table('users').select('''
            id, phone, nickname, avatar_url,
            tracks!tracks_uploader_id_fkey(plays, likes)
        ''').eq('is_dj', True).eq('is_active', True).execute()
        
        dj_rankings = []
        for dj in djs_result.data:
            tracks = dj.get('tracks', [])
            total_plays = sum(track.get('plays', 0) for track in tracks)
            total_likes = sum(track.get('likes', 0) for track in tracks)
            track_count = len(tracks)
            
            # 获取打赏统计
            tips_result = supabase.table('tips').select('amount').eq('to_user_id', dj['id']).execute()
            total_tips = sum(float(tip['amount']) for tip in tips_result.data)
            
            dj_rankings.append({
                'id': dj['id'],
                'name': dj.get('nickname') or dj['phone'],
                'avatar_url': dj.get('avatar_url'),
                'total_plays': total_plays,
                'total_likes': total_likes,
                'track_count': track_count,
                'total_tips': total_tips,
                'score': total_plays + total_likes * 2 + total_tips * 0.1  # 综合评分算法
            })
        
        # 按综合评分排序
        dj_rankings.sort(key=lambda x: x['score'], reverse=True)
        
        # 添加排名
        for i, dj in enumerate(dj_rankings):
            dj['rank'] = i + 1
        
        return jsonify({
            'rankings': dj_rankings[:50]  # 返回前50名
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
        
        # 保存对话记录
        conversation_data = [
            {
                'user_id': current_user['user_id'],
                'message': message,
                'is_from_user': True,
                'created_at': datetime.utcnow().isoformat()
            },
            {
                'user_id': current_user['user_id'],
                'message': response,
                'is_from_user': False,
                'created_at': datetime.utcnow().isoformat()
            }
        ]
        
        supabase.table('bot_conversations').insert(conversation_data).execute()
        
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

