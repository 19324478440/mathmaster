# 🚀 立即部署 - 最简单的方法

## ⚡ 方案 1: Railway（推荐，5分钟上线）

### 自动部署步骤：

1. **点击这个链接**：https://railway.app/new

2. **用 GitHub 登录**

3. **部署项目**：
   - 点击 **"Deploy from GitHub repo"**
   - 选择仓库：`19324478440/mathmaster`
   - Railway 会自动开始部署

4. **添加数据库**：
   - 在项目中点击 **"+ New"**
   - 选择 **"Database"** > **"MySQL"**
   - Railway 会自动创建数据库

5. **配置环境变量**：
   - 点击项目 > **"Variables"**
   - 添加以下变量：
     ```
     DB_TYPE=mysql
     JWT_SECRET=mathmaster_jwt_secret_key_2025
     NODE_ENV=production
     ```
   - Railway 会自动提供数据库连接变量（DB_HOST, DB_USER, DB_PASSWORD, DB_NAME）

6. **初始化数据库**：
   - 在数据库服务中，点击 **"Connect"**
   - 使用 MySQL 客户端连接（或使用 Railway 的 Query 功能）
   - 运行 `init.sql` 文件中的 SQL 语句

7. **完成！** Railway 会自动重新部署，完成后会给你一个 URL

---

## ⚡ 方案 2: Vercel（需要先配置数据库）

### 快速部署：

1. **安装并登录 Vercel CLI**：
   ```powershell
   vercel login
   ```

2. **创建 Supabase 数据库**（免费）：
   - 访问：https://supabase.com
   - 创建新项目
   - 在 SQL Editor 中运行 `init-postgres.sql`
   - 获取连接信息

3. **部署到 Vercel**：
   ```powershell
   vercel --prod
   ```

4. **配置环境变量**：
   - 访问 Vercel Dashboard
   - 进入项目 > Settings > Environment Variables
   - 添加数据库连接变量（见 setup-vercel-env.md）

---

## 📝 当前状态

✅ 代码已推送到 GitHub: `19324478440/mathmaster`
✅ 所有文件已准备好
✅ 部署配置已就绪

**现在只需要选择一个平台并部署！**

---

## 🎯 推荐：使用 Railway

Railway 是最简单的选择，因为：
- ✅ 自动配置数据库
- ✅ 自动设置环境变量
- ✅ 一键部署
- ✅ 完全免费（有免费额度）

**立即开始**：https://railway.app/new

