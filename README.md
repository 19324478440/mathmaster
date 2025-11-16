# MathMaster - 高中数学学习平台

一个全栈的高中数学学习平台，包含用户注册登录、学习进度跟踪、心得分享等功能。

## 功能特性

- ✅ 用户注册和登录
- ✅ 学习进度跟踪
- ✅ 关卡系统
- ✅ 每日打卡
- ✅ 心得分享
- ✅ 用户统计

## 技术栈

- 前端：HTML, CSS, JavaScript
- 后端：Node.js, Express
- 数据库：MySQL
- 认证：JWT

## 本地开发

1. 安装依赖：
```bash
npm install
```

2. 配置数据库（修改 `db.js`）：
```javascript
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'mathmaster'
};
```

3. 启动服务器：
```bash
npm start
```

4. 访问：http://localhost:3001

## 部署说明

### 环境变量

需要设置以下环境变量：
- `PORT`: 服务器端口（默认3001）
- `JWT_SECRET`: JWT密钥
- `DB_HOST`: 数据库主机
- `DB_USER`: 数据库用户名
- `DB_PASSWORD`: 数据库密码
- `DB_NAME`: 数据库名称

### 数据库初始化

需要创建数据库和表结构。请参考数据库初始化脚本。

## 许可证

MIT

