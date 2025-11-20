# 🚀 Vercel 部署指南

## ✅ 已完成的工作

1. ✅ 创建了所有 API 路由文件（Serverless Functions）
2. ✅ 创建了共享工具文件（`api/_utils.js`）
3. ✅ 创建了 Vercel 配置文件（`vercel.json`）

## 📁 项目结构

```
mathmaster/
├── api/                    # Vercel Serverless Functions
│   ├── _utils.js          # 共享工具函数
│   ├── register.js        # POST /api/register
│   ├── login.js           # POST /api/login
│   ├── user.js            # GET /api/user
│   ├── progress.js        # GET /api/progress
│   ├── progress/
│   │   └── update.js      # POST /api/progress/update
│   ├── checkin.js         # POST /api/checkin
│   ├── notes.js           # GET /api/notes
│   ├── notes/
│   │   └── [id]/
│   │       └── like.js    # POST /api/notes/:id/like
│   ├── contact.js         # POST /api/contact
│   └── health.js          # GET /api/health
├── index.html             # 前端页面
├── style.css              # 前端样式
├── app.js                 # 前端逻辑
├── db-universal.js        # 数据库连接
├── vercel.json            # Vercel 配置
└── package.json           # 项目配置
```

## 📋 部署步骤

### 第一步：准备代码

✅ 代码已经准备好，所有 API 路由已转换为 Serverless Functions

### 第二步：配置环境变量

在 Vercel 部署时，需要设置以下环境变量：

```
DB_TYPE=postgres
DB_HOST=db.xxxxx.supabase.co
DB_USER=postgres
DB_PASSWORD=你的Supabase密码
DB_NAME=postgres
DB_PORT=5432
NODE_ENV=production
JWT_SECRET=你的随机密钥（长字符串）
```

### 第三步：部署到 Vercel

1. **访问 Vercel**
   - 打开：https://vercel.com
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "Add New Project"
   - 选择 "Import Git Repository"
   - 选择你的 `mathmaster` 仓库
   - 点击 "Import"

3. **配置项目**
   - **Framework Preset**: 选择 "Other" 或 "Node.js"
   - **Root Directory**: 留空（默认）
   - **Build Command**: 留空（Vercel 会自动检测）
   - **Output Directory**: 留空
   - **Install Command**: `npm install`

4. **设置环境变量**
   - 在 "Environment Variables" 部分
   - 添加上面列出的所有环境变量
   - 点击 "Add" 保存每个变量

5. **部署**
   - 点击 "Deploy" 按钮
   - 等待部署完成（通常 2-3 分钟）

### 第四步：获取网站地址

部署完成后，Vercel 会提供：
- 免费域名：`mathmaster-xxxxx.vercel.app`
- 可以绑定自定义域名（可选）

## ⚠️ 注意事项

### 1. 动态路由处理

Vercel 的动态路由需要使用方括号 `[id]` 而不是 `:id`。

当前结构：
- `/api/notes/[id]/like.js` → 处理 `/api/notes/:id/like`

### 2. 前端 API 路径

前端代码中的 API 路径可能需要调整。检查 `app.js` 中的 API 调用：

```javascript
// 确保使用相对路径或完整 URL
const API_BASE = window.location.origin; // 自动获取当前域名
fetch(`${API_BASE}/api/login`, { ... });
```

### 3. 数据库连接

确保 Supabase 数据库：
- ✅ 已创建并初始化
- ✅ 连接信息正确
- ✅ 允许外部连接（Supabase 默认允许）

### 4. CORS 配置

所有 API 函数都已包含 CORS 头，允许跨域请求。

## 🧪 测试部署

部署完成后，测试以下功能：

1. ✅ 访问网站首页
2. ✅ 用户注册
3. ✅ 用户登录
4. ✅ 获取用户信息
5. ✅ 更新学习进度
6. ✅ 每日打卡
7. ✅ 获取心得列表
8. ✅ 点赞心得
9. ✅ 提交联系表单
10. ✅ 健康检查

## 🆘 常见问题

### 问题 1：API 返回 404

**解决方案：**
- 检查 `vercel.json` 配置
- 确保 API 文件在 `api/` 目录下
- 检查路由配置

### 问题 2：数据库连接失败

**解决方案：**
- 检查环境变量是否正确设置
- 检查 Supabase 数据库是否允许外部连接
- 查看 Vercel 日志

### 问题 3：CORS 错误

**解决方案：**
- 所有 API 函数已包含 CORS 头
- 如果仍有问题，检查前端请求头

## ✅ 完成！

部署完成后，你的网站就可以通过 Vercel 提供的地址访问了！

**优势：**
- ✅ 完全免费
- ✅ 无需信用卡
- ✅ 固定域名
- ✅ 24/7 运行
- ✅ 自动 HTTPS
- ✅ 全球 CDN 加速

---

需要帮助？告诉我你遇到的问题！

