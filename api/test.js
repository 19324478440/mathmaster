// GET /api/test - 简单测试函数
export default async function handler(req, res) {
  res.status(200).json({
    message: 'Vercel Serverless Function 工作正常！',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  });
}
