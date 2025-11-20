// GET /api/ping - 最简单的测试函数
module.exports = async (req, res) => {
  if (res) {
    return res.status(200).json({
      message: 'Pong!',
      timestamp: new Date().toISOString()
    });
  } else {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: 'Pong!',
        timestamp: new Date().toISOString()
      }),
    };
  }
};
