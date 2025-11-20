// 最简单的测试函数 - 完全不依赖任何东西
module.exports = async (req, res) => {
  try {
    if (res && res.json) {
      return res.status(200).json({ 
        ok: true, 
        message: 'API works!',
        timestamp: new Date().toISOString()
      });
    }
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        ok: true, 
        message: 'API works!',
        timestamp: new Date().toISOString()
      }),
    };
  } catch (error) {
    if (res && res.json) {
      return res.status(500).json({ error: error.message });
    }
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
