// GET /api - 最简单的测试
module.exports = async (req, res) => {
  try {
    if (res && res.json) {
      return res.status(200).json({ 
        ok: true, 
        message: 'API is working',
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
          ok: true, 
          message: 'API is working',
          timestamp: new Date().toISOString()
        }),
      };
    }
  } catch (error) {
    const errorResponse = {
      ok: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
    
    if (res && res.json) {
      return res.status(500).json(errorResponse);
    } else {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorResponse),
      };
    }
  }
};
