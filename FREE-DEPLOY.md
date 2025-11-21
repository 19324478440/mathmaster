# 💰 完全免费部署方案

## ✅ 方案 1: Vercel + Supabase（100% 免费，推荐）

### 为什么选择这个方案：
- ✅ Vercel：完全免费（无限部署、无限带宽）
- ✅ Supabase：完全免费（500MB 数据库、50,000 月活用户）
- ✅ 自动 HTTPS 和 CDN
- ✅ 无需信用卡

### 部署步骤：

#### 步骤 1: 创建 Supabase 数据库（2分钟）

1. 访问：https://supabase.com
2. 点击 "Start your project"
3. 用 GitHub 登录（免费）
4. 创建新项目：
   - 项目名称：mathmaster
   - 数据库密码：设置一个强密码（记住它！）
   - 区域：选择离你最近的（如 Singapore）
5. 等待项目创建（约 2 分钟）

#### 步骤 2: 初始化数据库

1. 在 Supabase Dashboard，点击左侧 "SQL Editor"
2. 点击 "New query"
3. 复制 `init-postgres.sql` 文件的内容
4. 粘贴到编辑器中
5. 点击 "Run" 执行
6. 看到 "Success" 表示成功

#### 步骤 3: 获取数据库连接信息

1. 在 Supabase Dashboard，点击左侧 "Settings" > "Database"
2. 找到 "Connection string" 部分
3. 点击 "URI" 标签
4. 复制连接字符串，格式类似：
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
5. 或者记录以下信息：
   - Host: `db.xxxxx.supabase.co`
   - Database: `postgres`
   - User: `postgres`
   - Password: 你设置的密码
   - Port: `5432`

#### 步骤 4: 部署到 Vercel（3分钟）

1. 访问：https://vercel.com
2. 用 GitHub 登录（免费）
3. 点击 "Add New..." > "Project"
4. 导入仓库：选择 `mathmaster`
5. 配置项目：
   - Framework Preset: **Other**
   - Root Directory: `./`（默认）
   - Build Command: `npm run build`（或留空）
   - Output Directory: `public`（或留空）
6. 添加环境变量（重要！）：
   点击 "Environment Variables"，添加：
   ```
   DB_TYPE=postgres
   DB_HOST=db.xxxxx.supabase.co（替换为你的）
   DB_USER=postgres
   DB_PASSWORD=你的密码（替换为你的）
   DB_NAME=postgres
   DB_PORT=5432
   JWT_SECRET=mathmaster_jwt_secret_key_2025
   NODE_ENV=production
   ```
7. 点击 "Deploy"
8. 等待部署完成（约 2-3 分钟）

#### 步骤 5: 完成！

- Vercel 会给你一个 URL（如：`https://mathmaster.vercel.app`）
- 访问该 URL 即可使用你的网站
- 使用 demo/demo 登录测试

---

## ✅ 方案 2: Railway（有免费额度）

### Railway 免费政策：
- ✅ $5 免费额度/月
- ✅ 足够运行小型项目
- ⚠️ 超出后需要付费（但通常不会超出）

### 如果选择 Railway：
1. 访问：https://railway.app
2. 用 GitHub 登录
3. 部署项目（步骤同之前）
4. Railway 会自动提供免费额度

---

## 💡 推荐：Vercel + Supabase

**为什么推荐这个方案：**
- ✅ 100% 免费，无限制
- ✅ 不需要信用卡
- ✅ 性能更好（CDN 加速）
- ✅ 更稳定（大公司支持）

---

## 📝 免费额度对比

| 服务 | 免费额度 | 限制 |
|------|---------|------|
| **Vercel** | 无限 | 无限制 |
| **Supabase** | 500MB 数据库 | 50,000 月活用户 |
| **Railway** | $5/月 | 超出需付费 |

---

## 🚀 立即开始

**推荐使用 Vercel + Supabase**，完全免费且无限制！

1. 先创建 Supabase：https://supabase.com
2. 再部署到 Vercel：https://vercel.com

需要我帮你一步步完成吗？

