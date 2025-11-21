# 🚀 MathMaster 网站部署指南

## 部署选项

你的网站需要数据库支持，以下是几个推荐的部署方案：

---

## 方案 1: Vercel + Supabase PostgreSQL（推荐 ⭐）

### 优点：
- ✅ 完全免费
- ✅ Vercel 部署简单快速
- ✅ Supabase 提供免费 PostgreSQL 数据库
- ✅ 自动 HTTPS 和 CDN

### 步骤：

#### 1. 准备 Supabase 数据库

1. 访问 [Supabase](https://supabase.com)，注册账号
2. 创建新项目
3. 在项目设置中找到 **Database** > **Connection string**
4. 记录以下信息：
   - Host
   - Database name
   - User
   - Password
   - Port (通常是 5432)

#### 2. 初始化 Supabase 数据库

在 Supabase Dashboard 中：
1. 进入 **SQL Editor**
2. 运行 `init-postgres.sql` 文件中的 SQL（需要适配 PostgreSQL 语法）
3. 或者使用我提供的初始化脚本

#### 3. 部署到 Vercel

**方法 A: 通过 GitHub（推荐）**

1. 将代码推送到 GitHub
2. 访问 [Vercel](https://vercel.com)，用 GitHub 登录
3. 点击 **New Project**，导入你的仓库
4. 在 **Environment Variables** 中添加：
   ```
   DB_TYPE=postgres
   DB_HOST=你的supabase-host
   DB_USER=你的supabase-user
   DB_PASSWORD=你的supabase-password
   DB_NAME=你的supabase-database
   DB_PORT=5432
   JWT_SECRET=mathmaster_jwt_secret_key_2025
   NODE_ENV=production
   ```
5. 点击 **Deploy**

**方法 B: 通过 Vercel CLI**

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel

# 设置环境变量
vercel env add DB_TYPE
vercel env add DB_HOST
vercel env add DB_USER
vercel env add DB_PASSWORD
vercel env add DB_NAME
vercel env add JWT_SECRET
```

---

## 方案 2: Railway（最简单 🎯）

### 优点：
- ✅ 一键部署全栈应用
- ✅ 自动配置数据库
- ✅ 免费额度充足
- ✅ 支持 MySQL 和 PostgreSQL

### 步骤：

1. 访问 [Railway](https://railway.app)，用 GitHub 登录
2. 点击 **New Project** > **Deploy from GitHub repo**
3. 选择你的仓库
4. Railway 会自动检测并部署
5. 添加 MySQL 数据库：
   - 点击 **New** > **Database** > **MySQL**
   - Railway 会自动创建数据库
6. 在项目设置中添加环境变量：
   ```
   DB_TYPE=mysql
   DB_HOST=从数据库服务获取
   DB_USER=从数据库服务获取
   DB_PASSWORD=从数据库服务获取
   DB_NAME=从数据库服务获取
   DB_PORT=3306
   JWT_SECRET=mathmaster_jwt_secret_key_2025
   ```
7. 部署完成后，Railway 会给你一个 URL

---

## 方案 3: Render（需要信用卡）

### 优点：
- ✅ 免费套餐可用
- ✅ 支持 MySQL 和 PostgreSQL
- ⚠️ 需要绑定信用卡（但免费套餐不收费）

### 步骤：

1. 访问 [Render](https://render.com)
2. 创建 **Web Service**，连接 GitHub
3. 创建 **PostgreSQL** 或 **MySQL** 数据库
4. 设置环境变量（同 Railway）
5. 部署

---

## 方案 4: Vercel + PlanetScale MySQL

### 优点：
- ✅ 免费 MySQL 数据库
- ✅ 与 Vercel 集成良好

### 步骤：

1. 访问 [PlanetScale](https://planetscale.com)，创建账号
2. 创建数据库
3. 获取连接信息
4. 在 Vercel 中设置环境变量（同方案 1）

---

## 📝 部署前检查清单

- [ ] 代码已推送到 GitHub
- [ ] 数据库已创建并初始化
- [ ] 环境变量已配置
- [ ] `vercel.json` 配置正确
- [ ] `public/` 目录包含静态文件

---

## 🔧 本地测试生产环境

在部署前，可以本地测试生产配置：

```bash
# 设置环境变量
$env:DB_TYPE = "postgres"
$env:DB_HOST = "你的数据库host"
$env:DB_USER = "你的数据库用户"
$env:DB_PASSWORD = "你的数据库密码"
$env:DB_NAME = "你的数据库名"
$env:JWT_SECRET = "mathmaster_jwt_secret_key_2025"
$env:NODE_ENV = "production"

# 运行构建
npm run build

# 测试（如果使用 Vercel CLI）
vercel dev
```

---

## 🐛 常见问题

### 1. 数据库连接失败
- 检查环境变量是否正确
- 检查数据库是否允许外部连接
- 检查防火墙设置

### 2. API 返回 500 错误
- 查看 Vercel 的 Function Logs
- 检查数据库连接字符串
- 确认数据库表已创建

### 3. 静态文件无法访问
- 确认 `public/` 目录存在
- 检查 `vercel.json` 路由配置
- 运行 `npm run build` 确保文件已复制

---

## 📞 需要帮助？

如果遇到问题，请提供：
1. 部署平台（Vercel/Railway/Render）
2. 错误日志
3. 环境变量配置（隐藏敏感信息）

