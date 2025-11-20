// GET /api/user - 获取用户信息
const { successResponse, errorResponse, authenticateToken, queryOne } = require('./_utils');

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

    const user = await queryOne(
      'SELECT id, username, name, grade, specialty, learning_goal, challenge_direction, completed_levels, notes_count, consecutive_days, points FROM users WHERE id = ?',
      [authResult.user.id]
    );

    if (!user) {
      return errorResponse('用户不存在', 404);
    }

    return successResponse({
      id: user.id,
      username: user.username,
      name: user.name,
      grade: user.grade,
      specialty: user.specialty,
      learning_goal: user.learning_goal,
      challenge_direction: user.challenge_direction,
      statistics: {
        completed_levels: user.completed_levels,
        notes_count: user.notes_count,
        consecutive_days: user.consecutive_days,
        points: user.points
      }
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    return errorResponse('服务器内部错误', 500);
  }
};

