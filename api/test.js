// GET /api/test - 简单测试函数（不连接数据库）
module.exports = async (req) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      message: 'Vercel Serverless Function 工作正常！',
      timestamp: new Date().toISOString(),
      method: req.method || 'GET',
      url: req.url || '/api/test'
    }),
  };
};
