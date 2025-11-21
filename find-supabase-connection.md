# 🔍 如何找到 Supabase 数据库连接信息

## 如果当前页面没有连接字符串，试试这些方法：

### 方法 1: 从左侧菜单进入

1. **点击左侧菜单的 "Settings"（设置）**
2. **点击 "API" 标签**
3. 在 "Project API keys" 下方，找到 **"Database"** 部分
4. 那里会显示连接信息

### 方法 2: 从项目概览获取

1. **点击左侧菜单的 "Project Settings"（项目设置）**
2. 或者直接点击项目名称
3. 在概览页面，找到 **"Database"** 卡片
4. 点击查看连接信息

### 方法 3: 使用项目 ID 直接构造

根据你的项目 ID `qhwocyizzfyedsmykwth`，连接信息格式是：

```
Host: db.qhwocyizzfyedsmykwth.supabase.co
User: postgres
Database: postgres
Port: 5432
Password: 你创建项目时设置的密码
```

### 方法 4: 从环境变量获取

1. 在 Supabase Dashboard
2. 点击左侧 **"Settings"** > **"API"**
3. 找到 **"Project URL"** 和 **"Project API keys"**
4. 数据库连接信息通常在页面下方

---

## 📝 你需要的完整信息

即使找不到连接字符串，你也可以使用以下信息：

```
DB_TYPE=postgres
DB_HOST=db.qhwocyizzfyedsmykwth.supabase.co
DB_USER=postgres
DB_PASSWORD=你的密码（如果忘记了，在数据库设置页面重置）
DB_NAME=postgres
DB_PORT=5432
```

---

## 🔑 关于密码

如果你忘记了数据库密码：
1. 在当前页面（数据库设置）
2. 点击 **"重置数据库密码"** 按钮
3. 设置新密码并记录下来

---

## 🎯 下一步

即使没有看到连接字符串，你也可以：
1. 使用上面提供的连接信息（只需要密码）
2. 先初始化数据库（运行 SQL）
3. 然后部署到 Vercel

需要我帮你继续吗？

