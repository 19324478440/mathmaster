# 🔧 修复 Vercel 404 错误

## 问题诊断

从部署页面看到 404 错误，可能的原因：

1. **Output Directory 配置问题**
   - 如果设置为 `public`，文件应该在根目录
   - 如果留空，需要确保文件在正确位置

2. **路由配置问题**
   - `vercel.json` 的路由需要正确配置

## 解决方案

### 方案 1: 检查 Vercel 项目设置

在 Vercel Dashboard：
1. 进入项目 **Settings** > **General**
2. 检查 **Output Directory**：
   - 如果设置为 `public`，保持
   - 如果留空，改为 `public` 或留空（Vercel 会自动检测）

### 方案 2: 简化 vercel.json

当前 `vercel.json` 配置应该是：
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### 方案 3: 检查构建输出

确保 `build.js` 正确运行，`public/` 目录包含：
- `index.html`
- `app.js`
- `style.css`

## 快速修复步骤

1. **在 Vercel Dashboard**：
   - Settings > General
   - **Output Directory**: 设置为 `public` 或留空
   - 保存

2. **重新部署**：
   - 在 Deployments 页面
   - 点击 "Redeploy"

3. **测试**：
   - 访问网站根 URL
   - 应该能看到登录页面

## 如果还是 404

检查 Vercel 的 **Build Logs**，查看：
- `public/` 目录是否被正确创建
- 文件是否被正确复制
- 是否有构建错误

