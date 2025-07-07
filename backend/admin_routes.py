from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import logging
from app import supabase, get_current_user
import csv
import io

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')
logger = logging.getLogger(__name__)

def require_admin(f):
    """装饰器：要求管理员权限"""
    def decorated_function(*args, **kwargs):
        current_user = get_current_user(request)
        if not current_user:
            return jsonify({'error': '未授权访问'}), 401
        
        if current_user['role'] not in ['admin', 'super_admin']:
            return jsonify({'error': '需要管理员权限'}), 403
        
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

def require_super_admin(f):
    """装饰器：要求超级管理员权限"""
    def decorated_function(*args, **kwargs):
        current_user = get_current_user(request)
        if not current_user:
            return jsonify({'error': '未授权访问'}), 401
        
        if current_user['role'] != 'super_admin':
            return jsonify({'error': '需要超级管理员权限'}), 403
        
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

@admin_bp.route('/dashboard', methods=['GET'])
@require_admin
def admin_dashboard():
    """管理员仪表板数据"""
    try:
        # 获取用户统计
        users_result = supabase.table('users').select('role, is_active, created_at').execute()
        users = users_result.data
        
        # 获取音乐统计
        tracks_result = supabase.table('tracks').select('plays, likes, created_at').execute()
        tracks = tracks_result.data
        
        # 获取交易统计
        transactions_result = supabase.table('transactions').select('type, amount, status, created_at').execute()
        transactions = transactions_result.data
        
        # 计算统计数据
        total_users = len(users)
        active_users = len([u for u in users if u.get('is_active', True)])
        total_djs = len([u for u in users if u.get('role') == 'dj'])
        
        total_tracks = len(tracks)
        total_plays = sum(track.get('plays', 0) for track in tracks)
        total_likes = sum(track.get('likes', 0) for track in tracks)
        
        # 计算财务数据
        completed_transactions = [t for t in transactions if t.get('status') == 'completed']
        total_revenue = sum(t.get('amount', 0) for t in completed_transactions if t.get('type') in ['recharge', 'vip_purchase'])
        total_withdrawals = sum(t.get('amount', 0) for t in completed_transactions if t.get('type') == 'withdraw')
        
        # 待处理的交易
        pending_recharges = [t for t in transactions if t.get('type') == 'recharge' and t.get('status') == 'pending']
        pending_withdrawals = [t for t in transactions if t.get('type') == 'withdraw' and t.get('status') == 'pending']
        
        return jsonify({
            'users': {
                'total': total_users,
                'active': active_users,
                'djs': total_djs
            },
            'tracks': {
                'total': total_tracks,
                'total_plays': total_plays,
                'total_likes': total_likes
            },
            'finance': {
                'total_revenue': float(total_revenue),
                'total_withdrawals': float(total_withdrawals),
                'net_profit': float(total_revenue - total_withdrawals),
                'pending_recharges': len(pending_recharges),
                'pending_withdrawals': len(pending_withdrawals)
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Admin dashboard error: {str(e)}")
        return jsonify({'error': '服务器内部错误'}), 500

@admin_bp.route('/users', methods=['GET'])
@require_admin
def get_users():
    """获取用户列表"""
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        search = request.args.get('search', '')
        role_filter = request.args.get('role', '')
        
        offset = (page - 1) * limit
        
        query = supabase.table('users').select('id, phone, role, balance, is_dj, is_active, created_at, last_login')
        
        if search:
            query = query.ilike('phone', f'%{search}%')
        
        if role_filter:
            query = query.eq('role', role_filter)
        
        result = query.order('created_at', desc=True).range(offset, offset + limit - 1).execute()
        
        return jsonify({
            'users': result.data,
            'page': page,
            'limit': limit
        }), 200
        
    except Exception as e:
        logger.error(f"Get users error: {str(e)}")
        return jsonify({'error': '服务器内部错误'}), 500

@admin_bp.route('/users/<user_id>/role', methods=['PUT'])
@require_super_admin
def update_user_role():
    """更新用户角色（仅超级管理员）"""
    try:
        user_id = request.view_args['user_id']
        data = request.get_json()
        new_role = data.get('role')
        
        if new_role not in ['user', 'dj', 'admin']:
            return jsonify({'error': '无效的角色'}), 400
        
        # 更新用户角色
        result = supabase.table('users').update({
            'role': new_role,
            'is_dj': new_role == 'dj',
            'updated_at': datetime.utcnow().isoformat()
        }).eq('id', user_id).execute()
        
        if result.data:
            return jsonify({
                'message': '用户角色更新成功',
                'user': result.data[0]
            }), 200
        else:
            return jsonify({'error': '用户不存在'}), 404
            
    except Exception as e:
        logger.error(f"Update user role error: {str(e)}")
        return jsonify({'error': '服务器内部错误'}), 500

@admin_bp.route('/users/<user_id>/status', methods=['PUT'])
@require_admin
def update_user_status():
    """更新用户状态（启用/禁用）"""
    try:
        user_id = request.view_args['user_id']
        data = request.get_json()
        is_active = data.get('is_active')
        
        if is_active is None:
            return jsonify({'error': '缺少is_active参数'}), 400
        
        result = supabase.table('users').update({
            'is_active': is_active,
            'updated_at': datetime.utcnow().isoformat()
        }).eq('id', user_id).execute()
        
        if result.data:
            return jsonify({
                'message': f"用户已{'启用' if is_active else '禁用'}",
                'user': result.data[0]
            }), 200
        else:
            return jsonify({'error': '用户不存在'}), 404
            
    except Exception as e:
        logger.error(f"Update user status error: {str(e)}")
        return jsonify({'error': '服务器内部错误'}), 500

@admin_bp.route('/dj-applications', methods=['GET'])
@require_admin
def get_dj_applications():
    """获取DJ认证申请列表"""
    try:
        status_filter = request.args.get('status', 'pending')
        
        query = supabase.table('dj_applications').select('''
            id, description, status, created_at, updated_at,
            users!dj_applications_user_id_fkey(id, phone)
        ''')
        
        if status_filter:
            query = query.eq('status', status_filter)
        
        result = query.order('created_at', desc=True).execute()
        
        return jsonify({
            'applications': result.data
        }), 200
        
    except Exception as e:
        logger.error(f"Get DJ applications error: {str(e)}")
        return jsonify({'error': '服务器内部错误'}), 500

@admin_bp.route('/dj-applications/<application_id>/review', methods=['PUT'])
@require_admin
def review_dj_application():
    """审核DJ认证申请"""
    try:
        application_id = request.view_args['application_id']
        current_user = get_current_user(request)
        data = request.get_json()
        
        status = data.get('status')  # 'approved' or 'rejected'
        review_notes = data.get('review_notes', '')
        
        if status not in ['approved', 'rejected']:
            return jsonify({'error': '无效的审核状态'}), 400
        
        # 获取申请信息
        app_result = supabase.table('dj_applications').select('*').eq('id', application_id).execute()
        if not app_result.data:
            return jsonify({'error': '申请不存在'}), 404
        
        application = app_result.data[0]
        user_id = application['user_id']
        
        # 更新申请状态
        supabase.table('dj_applications').update({
            'status': status,
            'reviewed_by': current_user['user_id'],
            'review_notes': review_notes,
            'reviewed_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat()
        }).eq('id', application_id).execute()
        
        # 如果批准，更新用户为DJ
        if status == 'approved':
            supabase.table('users').update({
                'role': 'dj',
                'is_dj': True,
                'updated_at': datetime.utcnow().isoformat()
            }).eq('id', user_id).execute()
        
        return jsonify({
            'message': f"DJ申请已{'批准' if status == 'approved' else '拒绝'}"
        }), 200
        
    except Exception as e:
        logger.error(f"Review DJ application error: {str(e)}")
        return jsonify({'error': '服务器内部错误'}), 500

@admin_bp.route('/transactions', methods=['GET'])
@require_admin
def get_transactions():
    """获取交易记录"""
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        transaction_type = request.args.get('type', '')
        status_filter = request.args.get('status', '')
        
        offset = (page - 1) * limit
        
        query = supabase.table('transactions').select('''
            id, type, amount, status, payment_method, payment_screenshot_url,
            description, created_at, processed_at,
            users!transactions_user_id_fkey(id, phone)
        ''')
        
        if transaction_type:
            query = query.eq('type', transaction_type)
        
        if status_filter:
            query = query.eq('status', status_filter)
        
        result = query.order('created_at', desc=True).range(offset, offset + limit - 1).execute()
        
        return jsonify({
            'transactions': result.data,
            'page': page,
            'limit': limit
        }), 200
        
    except Exception as e:
        logger.error(f"Get transactions error: {str(e)}")
        return jsonify({'error': '服务器内部错误'}), 500

@admin_bp.route('/transactions/<transaction_id>/process', methods=['PUT'])
@require_admin
def process_transaction():
    """处理交易（充值/提现审核）"""
    try:
        transaction_id = request.view_args['transaction_id']
        current_user = get_current_user(request)
        data = request.get_json()
        
        status = data.get('status')  # 'completed' or 'failed'
        notes = data.get('notes', '')
        
        if status not in ['completed', 'failed']:
            return jsonify({'error': '无效的交易状态'}), 400
        
        # 获取交易信息
        trans_result = supabase.table('transactions').select('*').eq('id', transaction_id).execute()
        if not trans_result.data:
            return jsonify({'error': '交易不存在'}), 404
        
        transaction = trans_result.data[0]
        user_id = transaction['user_id']
        amount = float(transaction['amount'])
        trans_type = transaction['type']
        
        # 更新交易状态
        supabase.table('transactions').update({
            'status': status,
            'processed_by': current_user['user_id'],
            'description': f"{transaction.get('description', '')} | 管理员备注: {notes}",
            'processed_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat()
        }).eq('id', transaction_id).execute()
        
        # 如果交易完成，更新用户余额
        if status == 'completed':
            user_result = supabase.table('users').select('balance').eq('id', user_id).execute()
            if user_result.data:
                current_balance = float(user_result.data[0]['balance'])
                
                if trans_type == 'recharge':
                    new_balance = current_balance + amount
                elif trans_type == 'withdraw':
                    new_balance = current_balance - amount
                    if new_balance < 0:
                        return jsonify({'error': '用户余额不足'}), 400
                else:
                    new_balance = current_balance
                
                supabase.table('users').update({
                    'balance': new_balance,
                    'updated_at': datetime.utcnow().isoformat()
                }).eq('id', user_id).execute()
        
        return jsonify({
            'message': f"交易已{'完成' if status == 'completed' else '失败'}"
        }), 200
        
    except Exception as e:
        logger.error(f"Process transaction error: {str(e)}")
        return jsonify({'error': '服务器内部错误'}), 500

@admin_bp.route('/notifications', methods=['GET'])
@require_admin
def get_notifications():
    """获取通知列表"""
    try:
        result = supabase.table('notifications').select('*').order('created_at', desc=True).execute()
        
        return jsonify({
            'notifications': result.data
        }), 200
        
    except Exception as e:
        logger.error(f"Get notifications error: {str(e)}")
        return jsonify({'error': '服务器内部错误'}), 500

@admin_bp.route('/notifications', methods=['POST'])
@require_admin
def create_notification():
    """创建新通知"""
    try:
        current_user = get_current_user(request)
        data = request.get_json()
        
        title = data.get('title')
        content = data.get('content')
        notification_type = data.get('type', 'general')
        expires_at = data.get('expires_at')
        
        if not title or not content:
            return jsonify({'error': '标题和内容不能为空'}), 400
        
        notification_data = {
            'title': title,
            'content': content,
            'type': notification_type,
            'is_active': True,
            'created_by': current_user['user_id'],
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat()
        }
        
        if expires_at:
            notification_data['expires_at'] = expires_at
        
        result = supabase.table('notifications').insert(notification_data).execute()
        
        if result.data:
            return jsonify({
                'message': '通知创建成功',
                'notification': result.data[0]
            }), 201
        else:
            return jsonify({'error': '创建失败'}), 500
            
    except Exception as e:
        logger.error(f"Create notification error: {str(e)}")
        return jsonify({'error': '服务器内部错误'}), 500

@admin_bp.route('/reports/financial', methods=['GET'])
@require_super_admin
def financial_report():
    """财务报表（超级管理员专用）"""
    try:
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        # 默认查询最近30天
        if not start_date:
            start_date = (datetime.utcnow() - timedelta(days=30)).isoformat()
        if not end_date:
            end_date = datetime.utcnow().isoformat()
        
        # 获取指定时间范围内的交易
        transactions_result = supabase.table('transactions').select('''
            id, type, amount, status, created_at, processed_at,
            users!transactions_user_id_fkey(phone)
        ''').gte('created_at', start_date).lte('created_at', end_date).execute()
        
        transactions = transactions_result.data
        
        # 计算各类统计数据
        completed_transactions = [t for t in transactions if t['status'] == 'completed']
        
        # 收入统计
        recharges = [t for t in completed_transactions if t['type'] == 'recharge']
        vip_purchases = [t for t in completed_transactions if t['type'] == 'vip_purchase']
        total_income = sum(float(t['amount']) for t in recharges + vip_purchases)
        
        # 支出统计
        withdrawals = [t for t in completed_transactions if t['type'] == 'withdraw']
        tips = [t for t in completed_transactions if t['type'] == 'tip']
        total_expenses = sum(float(t['amount']) for t in withdrawals + tips)
        
        # 待处理统计
        pending_recharges = [t for t in transactions if t['type'] == 'recharge' and t['status'] == 'pending']
        pending_withdrawals = [t for t in transactions if t['type'] == 'withdraw' and t['status'] == 'pending']
        
        pending_recharge_amount = sum(float(t['amount']) for t in pending_recharges)
        pending_withdrawal_amount = sum(float(t['amount']) for t in pending_withdrawals)
        
        # 生成报表
        report = {
            'period': {
                'start_date': start_date,
                'end_date': end_date
            },
            'income': {
                'total': total_income,
                'recharges': {
                    'count': len(recharges),
                    'amount': sum(float(t['amount']) for t in recharges)
                },
                'vip_purchases': {
                    'count': len(vip_purchases),
                    'amount': sum(float(t['amount']) for t in vip_purchases)
                }
            },
            'expenses': {
                'total': total_expenses,
                'withdrawals': {
                    'count': len(withdrawals),
                    'amount': sum(float(t['amount']) for t in withdrawals)
                },
                'tips': {
                    'count': len(tips),
                    'amount': sum(float(t['amount']) for t in tips)
                }
            },
            'profit': total_income - total_expenses,
            'pending': {
                'recharges': {
                    'count': len(pending_recharges),
                    'amount': pending_recharge_amount
                },
                'withdrawals': {
                    'count': len(pending_withdrawals),
                    'amount': pending_withdrawal_amount
                }
            },
            'summary': {
                'total_transactions': len(transactions),
                'completed_transactions': len(completed_transactions),
                'pending_transactions': len([t for t in transactions if t['status'] == 'pending']),
                'failed_transactions': len([t for t in transactions if t['status'] == 'failed'])
            }
        }
        
        return jsonify(report), 200
        
    except Exception as e:
        logger.error(f"Financial report error: {str(e)}")
        return jsonify({'error': '服务器内部错误'}), 500

@admin_bp.route('/reports/financial/export', methods=['GET'])
@require_super_admin
def export_financial_report():
    """导出财务报表为CSV"""
    try:
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        if not start_date:
            start_date = (datetime.utcnow() - timedelta(days=30)).isoformat()
        if not end_date:
            end_date = datetime.utcnow().isoformat()
        
        # 获取交易数据
        transactions_result = supabase.table('transactions').select('''
            id, type, amount, status, payment_method, created_at, processed_at,
            users!transactions_user_id_fkey(phone)
        ''').gte('created_at', start_date).lte('created_at', end_date).order('created_at', desc=True).execute()
        
        transactions = transactions_result.data
        
        # 生成CSV
        output = io.StringIO()
        writer = csv.writer(output)
        
        # 写入标题行
        writer.writerow([
            '交易ID', '用户手机号', '交易类型', '金额', '状态', 
            '支付方式', '创建时间', '处理时间'
        ])
        
        # 写入数据行
        for trans in transactions:
            writer.writerow([
                trans['id'],
                trans['users']['phone'] if trans['users'] else '',
                trans['type'],
                trans['amount'],
                trans['status'],
                trans.get('payment_method', ''),
                trans['created_at'],
                trans.get('processed_at', '')
            ])
        
        csv_content = output.getvalue()
        output.close()
        
        return jsonify({
            'csv_data': csv_content,
            'filename': f'financial_report_{start_date[:10]}_to_{end_date[:10]}.csv'
        }), 200
        
    except Exception as e:
        logger.error(f"Export financial report error: {str(e)}")
        return jsonify({'error': '服务器内部错误'}), 500

