# BeatMM Pro

BeatMM Pro 是一个功能齐全的音乐流媒体平台，旨在为用户提供卓越的音乐体验。该平台支持音乐上传、播放、搜索、评论、点赞、钱包系统、VIP 会员系统、DJ 认证以及管理员后台等功能。

## 技术栈

- **前端**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **后端**: FastAPI, Python
- **数据库/认证/存储**: Supabase
- **部署**: Vercel

## 功能模块

### 用户管理
- 用户注册与登录 (Supabase 邮箱验证码)
- 用户资料管理
- 钱包系统 (充值、消费记录)
- VIP 会员系统 (不同等级套餐，特权)
- DJ 认证系统 (申请、审核)

### 音乐管理
- 音乐上传 (标题、艺术家、封面、音频文件、标签、描述)
- 音乐播放 (流式播放、进度条、歌词、评论)
- 音乐搜索 (实时搜索音乐、艺术家、分类)
- 音乐评论与点赞
- 播放历史与收藏

### 社交与互动
- 音乐评论
- 音乐点赞
- 直播功能 (直播列表、直播间占位)

### 管理后台
- 用户管理
- 音乐审核
- 数据统计仪表板

## 页面列表

- 登录/注册页
- 首页 (推荐、热门、VIP 专区、直播预告)
- 搜索页
- 播放页
- 我的 (用户资料、收藏、播放历史、上传入口、VIP 状态)
- 上传页
- VIP 介绍页
- 钱包页
- 直播页
- DJ 认证页
- 管理后台 (待开发)

## 本地运行

### 前端

1. 进入 `frontend` 目录:
   ```bash
   cd frontend
   ```
2. 安装依赖:
   ```bash
   npm install
   ```
3. 配置环境变量 (`.env.local`):
   ```
   NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   ```
4. 运行开发服务器:
   ```bash
   npm run dev
   ```

### 后端

1. 进入 `backend` 目录:
   ```bash
   cd backend
   ```
2. 激活虚拟环境并安装依赖:
   ```bash
   source venv/bin/activate
   pip install -r requirements.txt
   ```
3. 配置环境变量 (`.env`):
   ```
   SUPABASE_URL=YOUR_SUPABASE_URL
   SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   ```
4. 运行 FastAPI 应用:
   ```bash
   uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
   ```

## 部署到 Vercel

本项目配置了 `vercel.json` 文件，可以直接通过 Vercel 平台进行部署。确保您的 Vercel 账户已连接到此 GitHub 仓库。

### 环境变量配置

在 Vercel 项目设置中，为前端和后端分别配置以下环境变量：

**前端 (Next.js)**:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**后端 (FastAPI)**:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

## Supabase 数据库设置

请在您的 Supabase 项目中创建以下表和函数。详细 SQL 脚本请参考项目文档或联系开发者。

## 贡献

欢迎提交 Pull Request 或报告 Bug。

## 许可证

MIT License


