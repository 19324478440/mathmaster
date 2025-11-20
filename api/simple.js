// GET /api/simple - 最简单的测试，不依赖任何东西
module.exports = async (req, res) => {
  if (res && res.json) {
    return res.status(200).json({ ok: true, message: 'Simple API works!' });
  } else {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ ok: true, message: 'Simple API works!' }),
    };
  }
};

