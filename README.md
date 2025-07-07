# Myanmar DJ Platform

这是一个为缅甸独立DJ和音乐爱好者设计的平台。它将提供音乐播放、DJ排行榜、直播打赏（未来规划）、用户管理、财务管理等功能。

## 项目结构

- `frontend/`: Next.js 前端应用
- `backend/`: Flask 后端 API

## 部署指南

### 前端部署 (Vercel)

1.  登录 Vercel。
2.  创建一个新项目，选择从Git导入项目。
3.  连接到您的GitHub仓库 `myanmar_dj_platform`。
4.  Vercel 会自动检测到 `frontend` 目录是一个Next.js项目，并进行部署。

### 后端部署 (Render/Railway)

1.  登录 Render (或 Railway)。
2.  创建一个新的Web服务，选择从Git导入项目。
3.  连接到您的GitHub仓库 `myanmar_dj_platform`。
4.  配置构建命令和启动命令（具体取决于您的Flask应用结构）。

### 数据库 (Supabase)

1.  登录 Supabase。
2.  创建一个新项目。
3.  获取您的项目API密钥和数据库连接字符串。
4.  在 `backend/.env` 文件中配置这些信息。

## 开发环境 (Gitpod)

推荐使用 [Gitpod](https://www.gitpod.io/) 进行开发。您可以通过点击以下链接直接在Gitpod中打开本项目：

[在Gitpod中打开](https://gitpod.io/#https://github.com/YOUR_GITHUB_USERNAME/myanmar_dj_platform)

请将 `YOUR_GITHUB_USERNAME` 替换为您的GitHub用户名。

## 联系方式

如果您在部署或使用过程中遇到任何问题，请通过GitHub Issues联系我。

