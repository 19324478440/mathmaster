// GET /api/test - 简单测试函数（不连接数据库）
module.exports = async (req, res) => {
  // 支持 Vercel 的新旧两种格式
  if (res) {
    // 新格式：使用 res 对象
    return res.status(200).json({
      message: 'Vercel Serverless Function 工作正常！',
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url
    });
  } else {
    // 旧格式：返回对象
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: 'Vercel Serverless Function 工作正常！',
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url
      }),
    };
  }
};
