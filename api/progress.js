// GET /api/progress - 获取学习进度
const { successResponse, errorResponse, authenticateToken, query } = require('./_utils');

module.exports = async (req) => {
  if (req.method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    };
  }

  if (req.method !== 'GET') {
    return errorResponse('方法不允许', 405);
  }

  try {
    // 验证 token
    const authResult = authenticateToken(req);
    if (authResult.error) {
      return errorResponse(authResult.error, authResult.statusCode);
    }

    const progressRows = await query(
      'SELECT theme, level, completed FROM user_progress WHERE user_id = ? ORDER BY theme, level',
      [authResult.user.id]
    );

    // 将数据库结果转换为前端需要的格式
    const progress = {};
    progressRows.forEach(row => {
      if (!progress[row.theme]) {
        progress[row.theme] = [];
      }
      progress[row.theme].push({
        level: row.level,
        completed: Boolean(row.completed)
      });
    });

    return successResponse(progress);
  } catch (error) {
    console.error('获取进度错误:', error);
    return errorResponse('服务器内部错误', 500);
  }
};

