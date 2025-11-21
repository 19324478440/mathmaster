// 完整的 Express 服务器（包含所有 API）
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// 将 Vercel Serverless Functions 转换为 Express 路由
function createRoute(handler) {
  return async (req, res) => {
    try {
      // 创建兼容的 req 对象
      const vercelReq = {
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: req.body,
        query: req.query
      };

      // 调用 Vercel 函数
      const result = await handler(vercelReq, res);
      
      // 如果返回的是对象（Vercel 格式），转换为 Express 响应
      if (result && result.statusCode && !res.headersSent) {
        res.status(result.statusCode);
        if (result.headers) {
          Object.keys(result.headers).forEach(key => {
            res.setHeader(key, result.headers[key]);
          });
        }
        res.send(result.body);
      }
    } catch (error) {
      console.error('API 错误:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: error.message });
      }
    }
  };
}

// 加载所有 API 路由
const apiDir = path.join(__dirname, 'api');

// 注册 API 路由
app.post('/api/register', createRoute(require('./api/register')));
app.post('/api/login', createRoute(require('./api/login')));
app.get('/api/user', createRoute(require('./api/user')));
app.get('/api/progress', createRoute(require('./api/progress')));
app.post('/api/progress/update', createRoute(require('./api/progress/update')));
app.post('/api/checkin', createRoute(require('./api/checkin')));
app.get('/api/notes', createRoute(require('./api/notes')));
app.post('/api/notes/:id/like', createRoute(require('./api/notes/[id]/like')));
app.post('/api/contact', createRoute(require('./api/contact')));
app.get('/api/health', createRoute(require('./api/health')));
app.get('/api/test', createRoute(require('./api/test')));

// 前端路由（SPA）
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 启动服务器
app.listen(PORT, () => {
  console.log('========================================');
  console.log('MathMaster 后端服务器启动成功！');
  console.log(`服务器运行在: http://localhost:${PORT}`);
  console.log('========================================');
  console.log('API 端点列表：');
  console.log('  ✅ POST   /api/register           - 用户注册');
  console.log('  ✅ POST   /api/login              - 用户登录');
  console.log('  ✅ GET    /api/user               - 获取用户信息');
  console.log('  ✅ GET    /api/progress           - 获取学习进度');
  console.log('  ✅ POST   /api/progress/update    - 更新关卡进度');
  console.log('  ✅ POST   /api/checkin            - 每日打卡');
  console.log('  ✅ GET    /api/notes              - 获取心得列表');
  console.log('  ✅ POST   /api/notes/:id/like     - 点赞心得');
  console.log('  ✅ POST   /api/contact            - 提交联系表单');
  console.log('  ✅ GET    /api/health             - 健康检查');
  console.log('  ✅ GET    /api/test               - 测试');
  console.log('========================================');
  console.log(`提示：可以直接访问 http://localhost:${PORT} 查看网站`);
  console.log('========================================');
});
