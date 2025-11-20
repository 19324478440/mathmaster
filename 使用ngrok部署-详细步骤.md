# 🚀 使用 ngrok 部署（完全免费，无需信用卡）

## 什么是 ngrok？

ngrok 是一个内网穿透工具，可以将你本地运行的服务器暴露到公网，让任何人都可以访问。

## 优点：
- ✅ 完全免费
- ✅ 不需要改代码
- ✅ 不需要信用卡
- ✅ 可以立即使用
- ✅ 支持 HTTPS

## 缺点：
- ⚠️ 需要保持电脑运行
- ⚠️ 免费版每次重启会换地址（付费版可以固定地址）

---

## 📋 部署步骤

### 第一步：注册 ngrok 账号

1. 访问：https://ngrok.com
2. 点击 "Sign up" 注册（可以使用邮箱注册）
3. 完成注册后，登录账号

### 第二步：获取 Authtoken

1. 登录后，访问：https://dashboard.ngrok.com/get-started/your-authtoken
2. 复制你的 Authtoken（类似：`2abc123xyz...`）

### 第三步：安装 ngrok

**Windows 安装方法：**

1. 访问：https://ngrok.com/download
2. 下载 Windows 版本
3. 解压到一个文件夹（例如：`C:\ngrok`）
4. 或者使用 Chocolatey：`choco install ngrok`

### 第四步：配置 ngrok

1. 打开 PowerShell 或 CMD
2. 运行以下命令（替换为你的 Authtoken）：
   ```bash
   ngrok config add-authtoken 你的Authtoken
   ```

### 第五步：启动本地服务器

1. 在你的项目文件夹中，运行：
   ```bash
   node server.js
   ```
2. 确保服务器运行在 `http://localhost:3001`

### 第六步：启动 ngrok

1. 打开新的 PowerShell 或 CMD 窗口
2. 运行：
   ```bash
   ngrok http 3001
   ```
3. 你会看到一个类似这样的输出：
   ```
   Forwarding  https://abc123.ngrok-free.app -> http://localhost:3001
   ```

### 第七步：获取公网地址

1. ngrok 会显示一个公网地址，类似：`https://abc123.ngrok-free.app`
2. 这个地址就是你的网站地址！
3. 任何人都可以通过这个地址访问你的网站

---

## 🔧 配置数据库连接

由于使用本地服务器，你需要：

1. **使用 Supabase 数据库**（我们已经创建好了）
2. 在项目根目录创建 `.env` 文件，添加：
   ```
   DB_TYPE=postgres
   DB_HOST=db.xxxxx.supabase.co
   DB_USER=postgres
   DB_PASSWORD=你的Supabase密码
   DB_NAME=postgres
   DB_PORT=5432
   NODE_ENV=production
   PORT=3001
   JWT_SECRET=你的随机密钥
   ```

---

## 📝 注意事项

1. **保持电脑运行**：关闭电脑后，网站就无法访问了
2. **地址会变化**：免费版每次重启 ngrok 会换地址
3. **固定地址**：如果需要固定地址，可以升级到付费版（$8/月）

---

## ✅ 完成！

现在你的网站已经可以通过公网访问了！

**访问地址：** `https://你的地址.ngrok-free.app`

---

需要我帮你一步步操作吗？

