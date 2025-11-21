# Vercel 环境变量配置指南

## 必需的环境变量

在 Vercel 项目设置中，添加以下环境变量：

### 如果使用 PostgreSQL (Supabase)

```
DB_TYPE=postgres
DB_HOST=db.xxxxx.supabase.co
DB_USER=postgres
DB_PASSWORD=你的密码
DB_NAME=postgres
DB_PORT=5432
JWT_SECRET=mathmaster_jwt_secret_key_2025
NODE_ENV=production
```

### 如果使用 MySQL (PlanetScale/Railway)

```
DB_TYPE=mysql
DB_HOST=你的数据库host
DB_USER=你的数据库用户
DB_PASSWORD=你的数据库密码
DB_NAME=你的数据库名
DB_PORT=3306
JWT_SECRET=mathmaster_jwt_secret_key_2025
NODE_ENV=production
```

## 如何设置

1. 登录 Vercel Dashboard
2. 选择你的项目
3. 进入 **Settings** > **Environment Variables**
4. 逐个添加上述变量
5. 选择环境（Production, Preview, Development）
6. 点击 **Save**

## 重要提示

- ⚠️ **不要**在代码中硬编码密码
- ✅ 所有敏感信息都通过环境变量传递
- ✅ 不同环境可以使用不同的数据库

