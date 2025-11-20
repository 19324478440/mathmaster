// GET /api/health - 健康检查
const { successResponse, query } = require('./_utils');

module.exports = async (req, res) => {
  // 支持 Vercel 的两种格式
  if (req.method === 'OPTIONS') {
    if (res) {
      return res.status(200).end();
    }
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    };
  }

  try {
    // 测试数据库连接（不阻塞响应）
    const dbConnected = await Promise.race([
      query('SELECT 1').then(() => true).catch(() => false),
      new Promise(resolve => setTimeout(() => resolve(false), 2000))
    ]);
    
    const response = {
      status: dbConnected ? 'healthy' : 'degraded',
      message: 'MathMaster API 服务运行正常',
      database: dbConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    };

    if (res && res.json) {
      return res.status(200).json(response);
    } else {
      return successResponse(response);
    }
  } catch (error) {
    // 即使数据库连接失败，也返回服务可用状态
    const response = {
      status: 'degraded',
      message: 'API 服务运行正常，但数据库未连接',
      database: 'disconnected',
      timestamp: new Date().toISOString()
    };

    if (res && res.json) {
      return res.status(200).json(response);
    } else {
      return successResponse(response);
    }
  }
};
