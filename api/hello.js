// GET /api/hello - 最简单的测试函数
export default async function handler(req, res) {
  res.status(200).json({
    success: true,
    message: 'Hello from Vercel!',
    timestamp: new Date().toISOString()
  });
}
