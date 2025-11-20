// GET /api/hello - 完全独立的测试函数
module.exports = async function handler(req) {
  try {
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
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: error.message
      }),
    };
  }
};

