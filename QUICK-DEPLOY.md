# ⚡ 快速部署指南（5分钟上线）

## 最简单的方法：Railway 🚂

### 步骤：

1. **访问 Railway**
   - 打开 https://railway.app
   - 用 GitHub 账号登录

2. **部署项目**
   - 点击 **New Project**
   - 选择 **Deploy from GitHub repo**
   - 选择你的仓库

3. **添加数据库**
   - 在项目中点击 **+ New**
   - 选择 **Database** > **MySQL**
   - Railway 会自动创建数据库

4. **配置环境变量**
   - 点击项目 > **Variables**
   - 添加以下变量（Railway 会自动提供数据库连接信息）：
     ```
     DB_TYPE=mysql
     DB_HOST=${{MySQL.MYSQLHOST}}
     DB_USER=${{MySQL.MYSQLUSER}}
     DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
     DB_NAME=${{MySQL.MYSQLDATABASE}}
     DB_PORT=${{MySQL.MYSQLPORT}}
     JWT_SECRET=mathmaster_jwt_secret_key_2025
     NODE_ENV=production
     ```

5. **初始化数据库**
   - 在 Railway 的数据库服务中，点击 **Connect**
   - 使用 MySQL 客户端连接
   - 运行 `init.sql` 文件中的 SQL

6. **完成！**
   - Railway 会自动部署
   - 部署完成后会给你一个 URL
   - 访问 URL 即可使用网站

---

## 或者：Vercel + Supabase（需要两步）

### 步骤 1: 创建 Supabase 数据库

1. 访问 https://supabase.com，注册账号
2. 创建新项目
3. 在 **SQL Editor** 中运行 `init-postgres.sql`
4. 在 **Settings** > **Database** 中获取连接信息

### 步骤 2: 部署到 Vercel

1. 访问 https://vercel.com，用 GitHub 登录
2. 点击 **New Project**，导入仓库
3. 在 **Environment Variables** 中添加：
   ```
   DB_TYPE=postgres
   DB_HOST=你的supabase-host
   DB_USER=postgres
   DB_PASSWORD=你的supabase-password
   DB_NAME=postgres
   DB_PORT=5432
   JWT_SECRET=mathmaster_jwt_secret_key_2025
   NODE_ENV=production
   ```
4. 点击 **Deploy**

---

## 📝 部署前准备

确保代码已推送到 GitHub：

```bash
git add .
git commit -m "准备部署"
git push origin main
```

---

## ✅ 部署后检查

1. 访问你的网站 URL
2. 测试注册/登录功能
3. 检查 `/api/health` 端点是否正常
4. 确认数据库连接正常

---

## 🆘 遇到问题？

查看 `DEPLOY.md` 获取详细帮助，或检查：
- 环境变量是否正确
- 数据库是否已初始化
- Vercel/Railway 的部署日志

