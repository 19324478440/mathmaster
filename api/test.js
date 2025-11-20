// GET /api/test - 简单测试函数
module.exports = async (req, res) => {
  if (res) {
    return res.status(200).json({
      message: 'Vercel Serverless Function 工作正常！',
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url
    });
  } else {
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
  }
};
