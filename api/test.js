// 最简单的测试函数
module.exports = (req, res) => {
  if (res && res.json) {
    return res.status(200).json({ ok: true, message: 'API works!' });
  }
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true, message: 'API works!' })
  };
};

