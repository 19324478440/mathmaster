// GET /api/hello - 最简单的测试函数
module.exports = async (req, res) => {
  if (res) {
    // Vercel 新格式：使用 res 对象
    return res.status(200).json({
      success: true,
      message: 'Hello from Vercel!',
      timestamp: new Date().toISOString()
    });
  } else {
    // Vercel 旧格式：返回对象
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        message: 'Hello from Vercel!',
        timestamp: new Date().toISOString()
      }),
    };
  }
};
