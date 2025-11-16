# MathMaster 部署指南

本指南将帮助你将 MathMaster 网站部署到公网，让其他人也能访问。

## 🚀 推荐部署平台

### 方案1：Railway（推荐，最简单）

**优点：**
- ✅ 免费额度充足
- ✅ 支持 Node.js 和 MySQL
- ✅ 自动部署
- ✅ 简单易用

**步骤：**

1. **注册 Railway 账号**
   - 访问 https://railway.app
   - 使用 GitHub 账号登录

2. **创建新项目**
   - 点击 "New Project"
   - 选择 "Deploy from GitHub repo"
   - 选择你的代码仓库

3. **添加 MySQL 数据库**
   - 在项目中点击 "New"
   - 选择 "Database" → "MySQL"
   - Railway 会自动创建数据库

4. **配置环境变量**
   在项目设置中添加以下环境变量：
   ```
   PORT=3001
   JWT_SECRET=your_secret_key_here_change_this
   DB_HOST=数据库主机地址（Railway会自动提供）
   DB_USER=数据库用户名（Railway会自动提供）
   DB_PASSWORD=数据库密码（Railway会自动提供）
   DB_NAME=数据库名称（Railway会自动提供）
   ```

5. **初始化数据库**
   - 在 Railway 的数据库服务中，点击 "Connect" 获取连接信息
   - 使用 MySQL 客户端连接数据库
   - 执行数据库初始化脚本创建表结构

6. **部署完成**
   - Railway 会自动部署
   - 点击 "Settings" → "Generate Domain" 获取公网地址

---

### 方案2：Render（免费，推荐）

**优点：**
- ✅ 免费套餐可用
- ✅ 支持 Node.js 和 PostgreSQL/MySQL
- ✅ 自动 HTTPS
- ✅ 简单配置

**步骤：**

1. **注册 Render 账号**
   - 访问 https://render.com
   - 使用 GitHub 账号登录

2. **创建 Web Service**
   - 点击 "New" → "Web Service"
   - 连接你的 GitHub 仓库
   - 设置：
     - Name: mathmaster
     - Environment: Node
     - Build Command: `npm install`
     - Start Command: `npm start`

3. **添加 PostgreSQL 数据库**
   - 点击 "New" → "PostgreSQL"
   - 创建数据库实例
   - 注意：需要修改代码以支持 PostgreSQL，或使用 MySQL 插件

4. **配置环境变量**
   在 Web Service 的 Environment 中添加：
   ```
   PORT=3001
   JWT_SECRET=your_secret_key_here
   DB_HOST=数据库主机
   DB_USER=数据库用户
   DB_PASSWORD=数据库密码
   DB_NAME=数据库名称
   ```

---

### 方案3：Vercel + PlanetScale（MySQL云数据库）

**优点：**
- ✅ Vercel 免费且快速
- ✅ PlanetScale 提供免费 MySQL
- ✅ 全球 CDN 加速

**步骤：**

1. **部署后端到 Vercel**
   - 访问 https://vercel.com
   - 导入 GitHub 仓库
   - 配置：
     - Framework Preset: Other
     - Build Command: `npm install`
     - Output Directory: `.`
     - Install Command: `npm install`

2. **创建 PlanetScale 数据库**
   - 访问 https://planetscale.com
   - 创建免费数据库
   - 获取连接信息

3. **配置环境变量**
   在 Vercel 项目设置中添加数据库连接信息

---

### 方案4：云服务器（阿里云/腾讯云）

**优点：**
- ✅ 完全控制
- ✅ 可以自定义配置
- ✅ 适合长期使用

**步骤：**

1. **购买云服务器**
   - 选择 Ubuntu 或 CentOS 系统
   - 最低配置：1核2G

2. **安装 Node.js 和 MySQL**
   ```bash
   # 安装 Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # 安装 MySQL
   sudo apt-get update
   sudo apt-get install mysql-server
   ```

3. **上传代码**
   ```bash
   git clone your-repo-url
   cd your-project
   npm install
   ```

4. **配置环境变量**
   创建 `.env` 文件或使用 `export` 命令

5. **使用 PM2 运行**
   ```bash
   npm install -g pm2
   pm2 start server.js --name mathmaster
   pm2 save
   pm2 startup
   ```

6. **配置 Nginx 反向代理**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## 📝 部署前准备

### 1. 修改前端 API 地址

前端代码已经自动检测环境，本地开发使用 `localhost:3001`，生产环境使用相对路径。

### 2. 数据库初始化

需要创建数据库表结构。如果你有 `init.sql` 文件，在部署后执行它。

### 3. 安全配置

- ✅ 修改 `JWT_SECRET` 为强密码
- ✅ 不要在代码中硬编码数据库密码
- ✅ 使用环境变量存储敏感信息

---

## 🔧 快速部署检查清单

- [ ] 代码已推送到 GitHub
- [ ] 环境变量已配置
- [ ] 数据库已创建并初始化
- [ ] 前端 API 地址已更新（已自动处理）
- [ ] 测试注册和登录功能
- [ ] 检查 HTTPS 是否启用

---

## 💡 推荐方案

**对于初学者：** Railway（最简单，一键部署）

**对于有经验的开发者：** Render 或 Vercel + PlanetScale

**对于需要完全控制：** 云服务器

---

## 🆘 遇到问题？

1. 检查服务器日志
2. 确认环境变量配置正确
3. 确认数据库连接正常
4. 检查端口是否正确暴露

祝你部署顺利！🎉

