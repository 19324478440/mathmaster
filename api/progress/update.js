// POST /api/progress/update - 更新关卡进度
const { successResponse, errorResponse, authenticateToken, parseBody, query, queryOne } = require('../_utils');

module.exports = async (req) => {
  if (req.method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    };
  }

  if (req.method !== 'POST') {
    return errorResponse('方法不允许', 405);
  }

  try {
    // 验证 token
    const authResult = authenticateToken(req);
    if (authResult.error) {
      return errorResponse(authResult.error, authResult.statusCode);
    }

    const body = parseBody(req);
    const { theme, level } = body;

    if (!theme || !level) {
      return errorResponse('缺少必要参数：theme 和 level', 400);
    }

    const isPostgres = process.env.DB_TYPE === 'postgres' || (process.env.DB_HOST && process.env.DB_HOST.includes('postgres'));

    // 插入或更新进度
    if (isPostgres) {
      await query(
        `INSERT INTO user_progress (user_id, theme, level, completed, completed_at) 
         VALUES ($1, $2, $3, TRUE, CURRENT_TIMESTAMP) 
         ON CONFLICT (user_id, theme, level) 
         DO UPDATE SET completed = TRUE, completed_at = CURRENT_TIMESTAMP`,
        [authResult.user.id, theme, level]
      );
    } else {
      await query(
        `INSERT INTO user_progress (user_id, theme, level, completed, completed_at) 
         VALUES (?, ?, ?, TRUE, NOW()) 
         ON DUPLICATE KEY UPDATE completed = TRUE, completed_at = NOW()`,
        [authResult.user.id, theme, level]
      );
    }

    // 重新计算完成的关卡数
    const completedCount = await queryOne(
      'SELECT COUNT(*) as count FROM user_progress WHERE user_id = ? AND completed = TRUE',
      [authResult.user.id]
    );

    // 获取用户信息以计算积分
    const user = await queryOne(
      'SELECT consecutive_days FROM users WHERE id = ?',
      [authResult.user.id]
    );

    const points = (completedCount.count * 10) + (user.consecutive_days * 5);

    // 更新用户统计信息
    await query(
      'UPDATE users SET completed_levels = ?, points = ? WHERE id = ?',
      [completedCount.count, points, authResult.user.id]
    );

    // 返回更新后的进度
    const progressRows = await query(
      'SELECT theme, level, completed FROM user_progress WHERE user_id = ? ORDER BY theme, level',
      [authResult.user.id]
    );

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

    const updatedUser = await queryOne(
      'SELECT completed_levels, points FROM users WHERE id = ?',
      [authResult.user.id]
    );

    return successResponse({
      message: '进度更新成功',
      progress: progress,
      statistics: {
        completed_levels: updatedUser.completed_levels,
        points: updatedUser.points
      }
    });
  } catch (error) {
    console.error('更新进度错误:', error);
    return errorResponse('服务器内部错误', 500);
  }
};

