# 🔍 Supabase 数据库连接信息获取指南

## 你当前在的位置
✅ 你已经在 **"数据库设置"** 页面了！

## 如何获取完整的连接信息

### 方法 1: 从连接字符串获取（最简单）

1. **在当前页面，向下滚动**，找到 **"Connection string"**（连接字符串）部分
2. 你会看到几个标签：
   - **URI** - 完整连接字符串（推荐）
   - **JDBC** - Java 连接
   - **Node.js** - Node.js 连接
   - **Golang** - Go 连接
   - **Python** - Python 连接

3. **点击 "URI" 标签**，你会看到类似这样的字符串：
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.qhwocyizzfyedsmykwth.supabase.co:5432/postgres
   ```

4. **从这个字符串中提取信息**：
   - **Host（主机）**: `db.qhwocyizzfyedsmykwth.supabase.co`
   - **Database（数据库名）**: `postgres`
   - **User（用户名）**: `postgres`
   - **Password（密码）**: 你创建项目时设置的密码（如果忘记了，点击"重置数据库密码"）
   - **Port（端口）**: `5432`

### 方法 2: 从项目设置获取

1. 在左侧菜单，点击 **"Settings"**（设置）
2. 点击 **"API"** 标签
3. 在 **"Project URL"** 下方，找到 **"Database"** 部分
4. 那里会显示连接信息

### 方法 3: 从连接池配置获取

1. 在当前页面的 **"连接池配置"** 部分
2. 点击 **"文档"** 链接查看详细信息
3. 或者使用连接池的连接字符串（格式类似，但端口可能不同）

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

- **数据库密码**：如果你忘记了密码，在当前页面点击 **"重置数据库密码"** 按钮
- **连接字符串**：向下滚动页面，找到 **"Connection string"** 部分
- **SSL 连接**：Supabase 要求使用 SSL 连接，代码中已自动配置

---

## 🎯 下一步

1. 找到连接字符串后，记录下所有信息
2. 然后初始化数据库（运行 `init-postgres.sql`）
3. 最后部署到 Vercel 并配置环境变量

