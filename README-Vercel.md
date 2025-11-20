# MathMaster - Vercel 部署版本

## ✅ 重构完成

项目已成功从 Express 应用重构为 Vercel Serverless Functions。

## 📁 文件结构

```
api/
├── _utils.js              # 共享工具（CORS、认证、响应处理）
├── register.js            # 用户注册
├── login.js               # 用户登录
├── user.js                # 获取用户信息
├── progress.js            # 获取学习进度
├── progress/
│   └── update.js          # 更新进度
├── checkin.js             # 每日打卡
├── notes.js               # 获取心得列表
├── notes/
│   └── [id]/
│       └── like.js        # 点赞心得（动态路由）
├── contact.js             # 提交联系表单
└── health.js              # 健康检查
```

## 🚀 快速部署

1. **推送到 GitHub**
   ```bash
   git add .
   git commit -m "重构为 Vercel Serverless Functions"
   git push
   ```

2. **在 Vercel 部署**
   - 访问 https://vercel.com
   - 导入 GitHub 仓库
   - 配置环境变量
   - 部署

详细步骤请查看：`Vercel部署指南.md`

## ⚙️ 环境变量

需要在 Vercel 中配置：

```
DB_TYPE=postgres
DB_HOST=你的Supabase主机地址
DB_USER=postgres
DB_PASSWORD=你的Supabase密码
DB_NAME=postgres
DB_PORT=5432
JWT_SECRET=你的随机密钥
NODE_ENV=production
```

## 📝 注意事项

- 前端代码已自动适配，无需修改
- 所有 API 路由已转换为 Serverless Functions
- CORS 已配置，支持跨域请求
- 数据库连接使用 Supabase（已初始化）

## 🎉 优势

- ✅ 完全免费
- ✅ 无需信用卡
- ✅ 固定域名
- ✅ 24/7 运行
- ✅ 自动 HTTPS
- ✅ 全球 CDN

