# 缅甸DJ平台部署指南

## 项目概述

这是一个完整的DJ音乐平台，包含前端（Next.js）和后端（Flask）应用，支持多语言（中文、缅文、英文），具备用户管理、音乐播放、DJ认证、支付系统等功能。

## 技术栈

### 前端
- **框架**: Next.js 15 with TypeScript
- **UI库**: React Bootstrap
- **图标**: React Icons
- **样式**: Tailwind CSS + 自定义CSS
- **多语言**: 自定义i18n实现

### 后端
- **框架**: Flask
- **数据库**: Supabase (PostgreSQL)
- **认证**: JWT
- **支付**: KPay + KBZ Banking
- **文件存储**: Supabase Storage

## 部署步骤

### 1. 数据库设置 (Supabase)

1. 访问 [Supabase](https://supabase.com) 并创建新项目
2. 在SQL编辑器中执行 `backend/database_schema.sql` 文件
3. 获取项目URL和API密钥：
   - Project URL: `https://your-project.supabase.co`
   - Anon Key: 公开API密钥
   - Service Role Key: 服务端API密钥

### 2. 后端部署

#### 环境变量配置
复制 `backend/.env.example` 为 `backend/.env` 并填入以下信息：

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

# JWT Configuration
JWT_SECRET_KEY=your_very_secure_jwt_secret_key_here

# Flask Configuration
FLASK_ENV=production
FLASK_DEBUG=False

# Admin Configuration
SUPER_ADMIN_PHONE_1=09787715620
SUPER_ADMIN_PHONE_2=09424425049
SUPER_ADMIN_PASSWORD=black098980
```

#### 使用Vercel部署后端

1. 安装Vercel CLI：
```bash
npm install -g vercel
```

2. 在backend目录创建 `vercel.json`：
```json
{
  "version": 2,
  "builds": [
    {
      "src": "app_with_routes.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "app_with_routes.py"
    }
  ],
  "env": {
    "SUPABASE_URL": "@supabase_url",
    "SUPABASE_KEY": "@supabase_key",
    "SUPABASE_SERVICE_KEY": "@supabase_service_key",
    "JWT_SECRET_KEY": "@jwt_secret_key"
  }
}
```

3. 部署：
```bash
cd backend
vercel --prod
```

4. 设置环境变量：
```bash
vercel env add SUPABASE_URL
vercel env add SUPABASE_KEY
vercel env add SUPABASE_SERVICE_KEY
vercel env add JWT_SECRET_KEY
```

### 3. 前端部署

#### 使用Vercel部署前端

1. 在frontend目录创建 `vercel.json`：
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NEXT_PUBLIC_API_URL": "@api_url"
  }
}
```

2. 更新 `frontend/.env.local`：
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app
```

3. 部署：
```bash
cd frontend
vercel --prod
```

### 4. 域名配置（可选）

1. 在Vercel项目设置中添加自定义域名
2. 配置DNS记录指向Vercel
3. 启用HTTPS（Vercel自动配置）

## 手机开发环境设置

### 使用Gitpod（推荐）

1. 访问 [Gitpod](https://gitpod.io)
2. 连接GitHub账户
3. 打开项目：`https://gitpod.io/#https://github.com/BB808B/Beatmm02`
4. Gitpod会自动配置开发环境

### 本地手机开发（Android）

使用Termux：
```bash
# 安装Termux
# 在Termux中安装Node.js和Python
pkg update && pkg upgrade
pkg install nodejs python git

# 克隆项目
git clone https://github.com/BB808B/Beatmm02.git
cd Beatmm02

# 安装依赖
cd frontend && npm install
cd ../backend && pip install -r requirements.txt
```

## 功能特性

### 用户功能
- ✅ 手机号注册/登录
- ✅ 多语言切换（中文/缅文/英文）
- ✅ 音乐播放/暂停/切换
- ✅ 音乐搜索和分类
- ✅ 用户资料管理
- ✅ 三天免费试听活动

### DJ功能
- ✅ DJ认证申请
- ✅ 音乐上传管理
- ✅ 收入统计
- ✅ 打赏接收

### 支付功能
- ✅ KPay二维码支付
- ✅ KBZ Banking转账
- ✅ 充值/提现管理
- ✅ VIP会员购买
- ✅ 打赏系统

### 管理功能
- ✅ 用户管理
- ✅ DJ认证审核
- ✅ 交易处理
- ✅ 财务报表
- ✅ 通知发布
- ✅ 支付信息管理

### 其他功能
- ✅ DJ排行榜
- ✅ 机器人客服
- ✅ 响应式设计
- ✅ 越南鼓DJ主题设计

## API文档

### 认证接口
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/profile` - 获取用户资料

### 音乐接口
- `GET /api/music/tracks` - 获取音乐列表
- `POST /api/music/upload` - 上传音乐（DJ专用）

### 支付接口
- `POST /api/payment/recharge` - 创建充值请求
- `POST /api/payment/withdraw` - 创建提现请求
- `POST /api/payment/tip` - 发送打赏
- `GET /api/payment/transactions` - 获取交易记录

### 管理接口
- `GET /api/admin/dashboard` - 管理员仪表板
- `GET /api/admin/users` - 用户管理
- `GET /api/admin/transactions` - 交易管理
- `POST /api/admin/notifications` - 发布通知

## 安全注意事项

1. **更改默认密码**: 部署后立即更改超级管理员密码
2. **JWT密钥**: 使用强随机字符串作为JWT密钥
3. **环境变量**: 不要在代码中硬编码敏感信息
4. **HTTPS**: 生产环境必须使用HTTPS
5. **数据库安全**: 配置Supabase行级安全策略

## 监控和维护

1. **日志监控**: 使用Vercel Analytics监控应用性能
2. **错误追踪**: 集成Sentry等错误追踪服务
3. **备份**: 定期备份Supabase数据库
4. **更新**: 定期更新依赖包和安全补丁

## 支持和联系

如有问题，请通过以下方式联系：
- GitHub Issues: [项目Issues页面](https://github.com/BB808B/Beatmm02/issues)
- 超级管理员: 09787715620, 09424425049

## 许可证

本项目采用MIT许可证，详见LICENSE文件。

