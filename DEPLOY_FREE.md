# MathMaster 免费部署指南 🆓

本指南提供**完全免费**的部署方案，让任何人都可以访问你的网站。

## 🎯 最佳免费方案推荐

### ⭐ 方案1：Render（推荐，最稳定）

**完全免费，无需信用卡！**

**免费额度：**
- ✅ 750小时/月（足够24/7运行）
- ✅ 免费 MySQL 数据库
- ✅ 自动 HTTPS
- ✅ 自动部署

**部署步骤：**

1. **注册账号**
   - 访问 https://render.com
   - 点击 "Get Started for Free"
   - 使用 GitHub 账号登录（最简单）

2. **创建 Web Service**
   - 登录后点击 "New +" → "Web Service"
   - 连接你的 GitHub 仓库
   - 如果还没有代码在 GitHub，先推送代码：
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     # 在 GitHub 创建新仓库后
     git remote add origin https://github.com/你的用户名/mathmaster.git
     git push -u origin main
     ```

3. **配置部署**
   - Name: `mathmaster`（任意名称）
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: 选择 **Free**

4. **添加免费 MySQL 数据库**
   - 在 Dashboard 点击 "New +" → "PostgreSQL"（Render 免费版提供 PostgreSQL）
   - 或者点击 "New +" → "MySQL"（如果有）
   - Plan: 选择 **Free**
   - 等待数据库创建完成

5. **配置环境变量**
   在 Web Service 的 Environment 标签页添加：
   ```
   PORT=10000
   NODE_ENV=production
   JWT_SECRET=your_random_secret_key_here_make_it_long_and_random
   DB_HOST=数据库主机地址（在数据库服务中查看）
   DB_USER=数据库用户名（在数据库服务中查看）
   DB_PASSWORD=数据库密码（在数据库服务中查看）
   DB_NAME=数据库名称（在数据库服务中查看）
   ```

6. **初始化数据库**
   - 在数据库服务的 "Connect" 标签页获取连接信息
   - 使用 MySQL 客户端（如 MySQL Workbench）连接
   - 执行 `init.sql` 脚本创建表结构

7. **部署完成**
   - Render 会自动部署
   - 部署完成后会显示 URL，例如：`https://mathmaster.onrender.com`
   - 首次访问可能需要等待30秒（免费版会休眠）

---

### 🌟 方案2：Railway（免费额度充足）

**免费额度：**
- ✅ $5/月免费额度
- ✅ 足够运行小型应用
- ✅ 支持 MySQL

**部署步骤：**

1. **注册账号**
   - 访问 https://railway.app
   - 使用 GitHub 登录

2. **创建项目**
   - 点击 "New Project"
   - 选择 "Deploy from GitHub repo"
   - 选择你的仓库

3. **添加 MySQL**
   - 点击 "New" → "Database" → "MySQL"
   - 选择 "Provision MySQL"

4. **配置环境变量**
   - 在项目 Settings → Variables 添加：
     ```
     PORT=3001
     JWT_SECRET=your_secret_key
     ```
   - 数据库变量会自动注入（Railway 会自动添加）

5. **初始化数据库**
   - 在 MySQL 服务中点击 "Connect"
   - 使用提供的连接信息连接数据库
   - 执行 `init.sql`

6. **获取域名**
   - 在 Web Service 的 Settings
   - 点击 "Generate Domain"

---

### 🚀 方案3：Fly.io（免费额度大）

**免费额度：**
- ✅ 3个共享CPU实例
- ✅ 3GB 存储
- ✅ 160GB 出站流量/月

**部署步骤：**

1. **安装 Fly CLI**
   ```bash
   # Windows (PowerShell)
   powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
   ```

2. **登录并创建应用**
   ```bash
   fly auth login
   fly launch
   ```

3. **配置数据库**
   - 使用 Fly Postgres（免费版）
   - 或使用外部免费 MySQL（如 PlanetScale）

---

### 💎 方案4：PlanetScale（免费 MySQL）+ Vercel（免费托管）

**完全免费，全球CDN加速！**

**步骤：**

1. **创建 PlanetScale 数据库**
   - 访问 https://planetscale.com
   - 注册账号（免费）
   - 创建数据库
   - 获取连接信息

2. **部署到 Vercel**
   - 访问 https://vercel.com
   - 导入 GitHub 仓库
   - 配置环境变量（数据库连接信息）
   - 自动部署完成

3. **获取域名**
   - Vercel 会自动分配域名
   - 例如：`mathmaster.vercel.app`

---

## 📋 部署前检查清单

- [ ] 代码已推送到 GitHub
- [ ] 已创建免费数据库
- [ ] 环境变量已配置
- [ ] 数据库已初始化（执行 init.sql）
- [ ] 测试注册和登录功能

---

## 🔧 常见问题

### Q: 免费版会休眠吗？
A: 
- Render: 免费版15分钟无访问会休眠，首次访问需等待30秒
- Railway: 不会休眠，但有限额
- Vercel: 不会休眠，但Serverless函数有冷启动

### Q: 数据库免费吗？
A: 
- Render: 提供免费 PostgreSQL
- Railway: 提供免费 MySQL（在$5额度内）
- PlanetScale: 提供免费 MySQL（5GB存储）

### Q: 需要信用卡吗？
A: **不需要！** 以上所有方案都无需信用卡。

---

## 🎯 我的推荐

**对于初学者：** Render（最简单，一键部署）

**对于需要性能：** Railway（不休眠，响应快）

**对于全球访问：** Vercel + PlanetScale（CDN加速）

---

## 📝 快速开始（Render 示例）

1. 推送代码到 GitHub
2. 访问 https://render.com 注册
3. 创建 Web Service，连接 GitHub 仓库
4. 创建 PostgreSQL 数据库
5. 配置环境变量
6. 等待部署完成
7. 访问你的网站！

**预计时间：15-20分钟**

---

祝你部署顺利！🎉

