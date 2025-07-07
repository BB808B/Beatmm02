from flask import Blueprint, request, jsonify
from datetime import datetime
import logging
from app import supabase, get_current_user
import uuid

payment_bp = Blueprint('payment', __name__, url_prefix='/api/payment')
logger = logging.getLogger(__name__)

@payment_bp.route('/recharge', methods=['POST'])
def create_recharge_request():
    """创建充值请求"""
    try:
        current_user = get_current_user(request)
        if not current_user:
            return jsonify({'error': '未授权访问'}), 401
        
        data = request.get_json()
        amount = data.get('amount')
        payment_method = data.get('payment_method')  # 'kpay' or 'kbz_banking'
        payment_screenshot_url = data.get('payment_screenshot_url')
        
        if not amount or amount <= 0:
            return jsonify({'error': '充值金额必须大于0'}), 400
        
        if payment_method not in ['kpay', 'kbz_banking']:
            return jsonify({'error': '无效的支付方式'}), 400
        
        if not payment_screenshot_url:
            return jsonify({'error': '请上传支付截图'}), 400
        
        # 生成唯一的参考ID
        reference_id = f"RECHARGE_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{str(uuid.uuid4())[:8]}"
        
        # 创建充值记录
        transaction_data = {
            'user_id': current_user['user_id'],
            'type': 'recharge',
            'amount': amount,
            'status': 'pending',
            'payment_method': payment_method,
            'payment_screenshot_url': payment_screenshot_url,
            'reference_id': reference_id,
            'description': f'用户充值 - {payment_method}',
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat()
        }
        
        result = supabase.table('transactions').insert(transaction_data).execute()
        
        if result.data:
            return jsonify({
                'message': '充值请求提交成功，请等待管理员审核',
                'transaction': result.data[0]
            }), 201
        else:
            return jsonify({'error': '充值请求提交失败'}), 500
            
    except Exception as e:
        logger.error(f"Create recharge request error: {str(e)}")
        return jsonify({'error': '服务器内部错误'}), 500

@payment_bp.route('/withdraw', methods=['POST'])
def create_withdraw_request():
    """创建提现请求"""
    try:
        current_user = get_current_user(request)
        if not current_user:
            return jsonify({'error': '未授权访问'}), 401
        
        data = request.get_json()
        amount = data.get('amount')
        payment_method = data.get('payment_method')  # 'kpay' or 'kbz_banking'
        account_info = data.get('account_info')  # 收款账户信息
        
        if not amount or amount <= 0:
            return jsonify({'error': '提现金额必须大于0'}), 400
        
        if payment_method not in ['kpay', 'kbz_banking']:
            return jsonify({'error': '无效的支付方式'}), 400
        
        if not account_info:
            return jsonify({'error': '请提供收款账户信息'}), 400
        
        # 检查用户余额
        user_result = supabase.table('users').select('balance').eq('id', current_user['user_id']).execute()
        if not user_result.data:
            return jsonify({'error': '用户不存在'}), 404
        
        current_balance = float(user_result.data[0]['balance'])
        if current_balance < amount:
            return jsonify({'error': '余额不足'}), 400
        
        # 生成唯一的参考ID
        reference_id = f"WITHDRAW_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{str(uuid.uuid4())[:8]}"
        
        # 创建提现记录
        transaction_data = {
            'user_id': current_user['user_id'],
            'type': 'withdraw',
            'amount': amount,
            'status': 'pending',
            'payment_method': payment_method,
            'reference_id': reference_id,
            'description': f'用户提现 - {payment_method} - 账户: {account_info}',
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat()
        }
        
        result = supabase.table('transactions').insert(transaction_data).execute()
        
        if result.data:
            return jsonify({
                'message': '提现请求提交成功，请等待管理员审核',
                'transaction': result.data[0]
            }), 201
        else:
            return jsonify({'error': '提现请求提交失败'}), 500
            
    except Exception as e:
        logger.error(f"Create withdraw request error: {str(e)}")
        return jsonify({'error': '服务器内部错误'}), 500

@payment_bp.route('/vip/purchase', methods=['POST'])
def purchase_vip():
    """购买VIP会员"""
    try:
        current_user = get_current_user(request)
        if not current_user:
            return jsonify({'error': '未授权访问'}), 401
        
        data = request.get_json()
        plan_type = data.get('plan_type')  # 'monthly' or 'yearly'
        payment_method = data.get('payment_method')
        payment_screenshot_url = data.get('payment_screenshot_url')
        
        if plan_type not in ['monthly', 'yearly']:
            return jsonify({'error': '无效的VIP套餐类型'}), 400
        
        if payment_method not in ['kpay', 'kbz_banking']:
            return jsonify({'error': '无效的支付方式'}), 400
        
        if not payment_screenshot_url:
            return jsonify({'error': '请上传支付截图'}), 400
        
        # VIP价格配置
        vip_prices = {
            'monthly': 10000,  # 10000缅币/月
            'yearly': 100000   # 100000缅币/年
        }
        
        amount = vip_prices[plan_type]
        
        # 生成唯一的参考ID
        reference_id = f"VIP_{plan_type.upper()}_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{str(uuid.uuid4())[:8]}"
        
        # 创建VIP购买记录
        transaction_data = {
            'user_id': current_user['user_id'],
            'type': 'vip_purchase',
            'amount': amount,
            'status': 'pending',
            'payment_method': payment_method,
            'payment_screenshot_url': payment_screenshot_url,
            'reference_id': reference_id,
            'description': f'VIP会员购买 - {plan_type} - {payment_method}',
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat()
        }
        
        result = supabase.table('transactions').insert(transaction_data).execute()
        
        if result.data:
            return jsonify({
                'message': 'VIP购买请求提交成功，请等待管理员审核',
                'transaction': result.data[0]
            }), 201
        else:
            return jsonify({'error': 'VIP购买请求提交失败'}), 500
            
    except Exception as e:
        logger.error(f"Purchase VIP error: {str(e)}")
        return jsonify({'error': '服务器内部错误'}), 500

@payment_bp.route('/tip', methods=['POST'])
def send_tip():
    """发送打赏"""
    try:
        current_user = get_current_user(request)
        if not current_user:
            return jsonify({'error': '未授权访问'}), 401
        
        data = request.get_json()
        to_user_id = data.get('to_user_id')
        track_id = data.get('track_id')  # 可选，针对特定音乐的打赏
        amount = data.get('amount')
        message = data.get('message', '')
        
        if not to_user_id or not amount or amount <= 0:
            return jsonify({'error': '打赏对象和金额不能为空'}), 400
        
        # 检查用户余额
        user_result = supabase.table('users').select('balance').eq('id', current_user['user_id']).execute()
        if not user_result.data:
            return jsonify({'error': '用户不存在'}), 404
        
        current_balance = float(user_result.data[0]['balance'])
        if current_balance < amount:
            return jsonify({'error': '余额不足'}), 400
        
        # 检查被打赏用户是否存在
        to_user_result = supabase.table('users').select('id, balance').eq('id', to_user_id).execute()
        if not to_user_result.data:
            return jsonify({'error': '被打赏用户不存在'}), 404
        
        to_user_balance = float(to_user_result.data[0]['balance'])
        
        # 计算平台手续费（例如10%）
        platform_fee_rate = 0.1
        platform_fee = amount * platform_fee_rate
        actual_tip_amount = amount - platform_fee
        
        try:
            # 开始事务处理
            # 1. 扣除打赏者余额
            supabase.table('users').update({
                'balance': current_balance - amount,
                'updated_at': datetime.utcnow().isoformat()
            }).eq('id', current_user['user_id']).execute()
            
            # 2. 增加被打赏者余额
            supabase.table('users').update({
                'balance': to_user_balance + actual_tip_amount,
                'updated_at': datetime.utcnow().isoformat()
            }).eq('id', to_user_id).execute()
            
            # 3. 记录打赏
            tip_data = {
                'from_user_id': current_user['user_id'],
                'to_user_id': to_user_id,
                'track_id': track_id,
                'amount': amount,
                'message': message,
                'created_at': datetime.utcnow().isoformat()
            }
            
            supabase.table('tips').insert(tip_data).execute()
            
            # 4. 记录交易
            transaction_data = {
                'user_id': current_user['user_id'],
                'type': 'tip',
                'amount': amount,
                'status': 'completed',
                'description': f'打赏用户 {to_user_id} - 平台手续费: {platform_fee}',
                'created_at': datetime.utcnow().isoformat(),
                'updated_at': datetime.utcnow().isoformat(),
                'processed_at': datetime.utcnow().isoformat()
            }
            
            supabase.table('transactions').insert(transaction_data).execute()
            
            return jsonify({
                'message': '打赏成功',
                'tip_amount': actual_tip_amount,
                'platform_fee': platform_fee
            }), 200
            
        except Exception as e:
            logger.error(f"Tip transaction error: {str(e)}")
            return jsonify({'error': '打赏处理失败，请重试'}), 500
            
    except Exception as e:
        logger.error(f"Send tip error: {str(e)}")
        return jsonify({'error': '服务器内部错误'}), 500

@payment_bp.route('/transactions', methods=['GET'])
def get_user_transactions():
    """获取用户交易记录"""
    try:
        current_user = get_current_user(request)
        if not current_user:
            return jsonify({'error': '未授权访问'}), 401
        
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        transaction_type = request.args.get('type', '')
        
        offset = (page - 1) * limit
        
        query = supabase.table('transactions').select('*').eq('user_id', current_user['user_id'])
        
        if transaction_type:
            query = query.eq('type', transaction_type)
        
        result = query.order('created_at', desc=True).range(offset, offset + limit - 1).execute()
        
        return jsonify({
            'transactions': result.data,
            'page': page,
            'limit': limit
        }), 200
        
    except Exception as e:
        logger.error(f"Get user transactions error: {str(e)}")
        return jsonify({'error': '服务器内部错误'}), 500

@payment_bp.route('/payment-info', methods=['GET'])
def get_payment_info():
    """获取平台支付信息（管理员的收款二维码等）"""
    try:
        # 获取所有管理员的支付信息
        admins_result = supabase.table('users').select('''
            id, phone, kpay_qr_url, kpay_account, kbz_account, kbz_account_name
        ''').in_('role', ['admin', 'super_admin']).execute()
        
        payment_info = []
        for admin in admins_result.data:
            if admin.get('kpay_qr_url') or admin.get('kbz_account'):
                payment_info.append({
                    'admin_id': admin['id'],
                    'admin_phone': admin['phone'],
                    'kpay': {
                        'qr_url': admin.get('kpay_qr_url'),
                        'account': admin.get('kpay_account')
                    },
                    'kbz_banking': {
                        'account': admin.get('kbz_account'),
                        'account_name': admin.get('kbz_account_name')
                    }
                })
        
        return jsonify({
            'payment_methods': payment_info,
            'instructions': {
                'kpay': '请使用KPay扫描二维码支付，并上传支付截图',
                'kbz_banking': '请转账到指定的KBZ Banking账户，并上传支付截图'
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Get payment info error: {str(e)}")
        return jsonify({'error': '服务器内部错误'}), 500

@payment_bp.route('/admin/payment-info', methods=['PUT'])
def update_admin_payment_info():
    """更新管理员支付信息"""
    try:
        current_user = get_current_user(request)
        if not current_user:
            return jsonify({'error': '未授权访问'}), 401
        
        if current_user['role'] not in ['admin', 'super_admin']:
            return jsonify({'error': '需要管理员权限'}), 403
        
        data = request.get_json()
        kpay_qr_url = data.get('kpay_qr_url')
        kpay_account = data.get('kpay_account')
        kbz_account = data.get('kbz_account')
        kbz_account_name = data.get('kbz_account_name')
        
        update_data = {
            'updated_at': datetime.utcnow().isoformat()
        }
        
        if kpay_qr_url is not None:
            update_data['kpay_qr_url'] = kpay_qr_url
        if kpay_account is not None:
            update_data['kpay_account'] = kpay_account
        if kbz_account is not None:
            update_data['kbz_account'] = kbz_account
        if kbz_account_name is not None:
            update_data['kbz_account_name'] = kbz_account_name
        
        result = supabase.table('users').update(update_data).eq('id', current_user['user_id']).execute()
        
        if result.data:
            return jsonify({
                'message': '支付信息更新成功',
                'user': result.data[0]
            }), 200
        else:
            return jsonify({'error': '更新失败'}), 500
            
    except Exception as e:
        logger.error(f"Update admin payment info error: {str(e)}")
        return jsonify({'error': '服务器内部错误'}), 500

