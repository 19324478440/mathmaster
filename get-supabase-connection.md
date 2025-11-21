# 🔍 如何获取 Supabase 数据库连接信息

## 方法 1: 从 Settings > Database 获取

1. 在 Supabase Dashboard，点击左侧 **"Settings"** > **"Database"**
2. 找到 **"Connection string"** 部分
3. 你会看到几个选项：
   - **URI** - 完整连接字符串
   - **JDBC** - Java 连接字符串
   - **Golang** - Go 连接字符串
   - **Node.js** - Node.js 连接字符串
   - **Python** - Python 连接字符串

4. 点击 **"URI"** 标签，你会看到类似这样的字符串：
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.qhwocyizzfyedsmykwth.supabase.co:5432/postgres
   ```

5. 从这个字符串中提取信息：
   - **Host**: `db.qhwocyizzfyedsmykwth.supabase.co`
   - **Database**: `postgres`
   - **User**: `postgres`
   - **Password**: `[YOUR-PASSWORD]`（你创建项目时设置的密码）
   - **Port**: `5432`

## 方法 2: 从项目设置获取

1. 在 Supabase Dashboard，点击左侧 **"Settings"** > **"API"**
2. 找到 **"Project URL"** 和 **"Project API keys"**
3. 数据库连接信息通常在 **"Database"** 标签下

## 方法 3: 使用 Connection Pooling（推荐用于生产环境）

1. 在 **"Database Settings"** 页面
2. 找到 **"Connection pooling"** 部分
3. 使用 **"Session mode"** 的连接字符串（更适合 Serverless）

---

## 📝 你需要的环境变量

根据你的项目 ID `qhwocyizzfyedsmykwth`，你的连接信息应该是：

```
DB_TYPE=postgres
DB_HOST=db.qhwocyizzfyedsmykwth.supabase.co
DB_USER=postgres
DB_PASSWORD=你的数据库密码（创建项目时设置的）
DB_NAME=postgres
DB_PORT=5432
JWT_SECRET=mathmaster_jwt_secret_key_2025
NODE_ENV=production
```

---

## ⚠️ 重要提示

- 数据库密码是创建项目时设置的，如果忘记了可以重置
- 连接字符串中的 `[YOUR-PASSWORD]` 需要替换为实际密码
- 确保在 Vercel 环境变量中正确设置这些值

