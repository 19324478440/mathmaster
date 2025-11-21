# 🚀 Vercel 部署配置指南

## 当前页面配置步骤

### 1. Project Name（项目名称）
- 保持默认：`mathmaster`
- 或者改成你喜欢的名字

### 2. Framework Preset（框架预设）
- **选择：Other**
- 不要选择 Express（这个项目是 Serverless Functions）

### 3. Root Directory（根目录）
- 保持默认：`./`（留空）
- 不需要修改

### 4. Build and Output Settings（构建和输出设置）

#### Build Command（构建命令）
- **留空** 或者填写：`npm run build`
- 这个项目会自动构建

#### Output Directory（输出目录）
- **留空** 或者填写：`public`
- Vercel 会自动处理

#### Install Command（安装命令）
- **留空**（使用默认：`npm install`）

### 5. Environment Variables（环境变量）⚠️ 最重要！

点击 "Add More" 按钮，逐个添加以下 7 个环境变量：

```
Key: DB_TYPE
Value: postgres

Key: DB_HOST
Value: db.qhwocyizzfyedsmykwth.supabase.co

Key: DB_USER
Value: postgres

Key: DB_PASSWORD
Value: cgqosGADRUyFJP0p

Key: DB_NAME
Value: postgres

Key: DB_PORT
Value: 5432

Key: JWT_SECRET
Value: mathmaster_jwt_secret_key_2025

Key: NODE_ENV
Value: production
```

### 6. 点击 "Deploy" 按钮

---

## 📋 快速复制清单

✅ Framework Preset: **Other**
✅ Build Command: **留空**
✅ Output Directory: **留空**
✅ Environment Variables: **添加上面的 7 个变量**

---

## ⚠️ 重要提示

1. **环境变量必须全部添加**，否则数据库无法连接
2. **DB_PASSWORD** 要确保正确（cgqosGADRUyFJP0p）
3. 部署完成后，访问 Vercel 给你的 URL 测试

---

## 🎯 部署后检查

1. 访问 Vercel 给你的 URL
2. 测试 `/api/health` 端点
3. 使用 demo/demo 登录测试

