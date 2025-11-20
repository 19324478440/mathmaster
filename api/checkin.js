// POST /api/checkin - 每日打卡
const { successResponse, errorResponse, authenticateToken, query, queryOne } = require('./_utils');

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

    const user = await queryOne(
      'SELECT id, last_checkin, consecutive_days, points FROM users WHERE id = ?',
      [authResult.user.id]
    );

    if (!user) {
      return errorResponse('用户不存在', 404);
    }

    const today = new Date().toISOString().split('T')[0];
    const lastCheckin = user.last_checkin ? new Date(user.last_checkin).toISOString().split('T')[0] : null;

    if (lastCheckin === today) {
      return successResponse({
        message: '今天已经打卡过了',
        consecutive_days: user.consecutive_days,
        points: user.points
      });
    }

    // 检查是否连续打卡
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newConsecutiveDays = user.consecutive_days;
    if (lastCheckin === yesterdayStr) {
      // 连续打卡
      newConsecutiveDays = user.consecutive_days + 1;
    } else if (lastCheckin !== today) {
      // 中断了，重新开始
      newConsecutiveDays = 1;
    }

    const newPoints = user.points + 10; // 打卡奖励积分

    const isPostgres = process.env.DB_TYPE === 'postgres' || (process.env.DB_HOST && process.env.DB_HOST.includes('postgres'));

    // 更新数据库
    if (isPostgres) {
      await query(
        'UPDATE users SET last_checkin = CURRENT_DATE, consecutive_days = $1, points = $2 WHERE id = $3',
        [newConsecutiveDays, newPoints, authResult.user.id]
      );
    } else {
      await query(
        'UPDATE users SET last_checkin = CURDATE(), consecutive_days = ?, points = ? WHERE id = ?',
        [newConsecutiveDays, newPoints, authResult.user.id]
      );
    }

    return successResponse({
      message: '打卡成功！获得10积分',
      consecutive_days: newConsecutiveDays,
      points: newPoints
    });
  } catch (error) {
    console.error('打卡错误:', error);
    return errorResponse('服务器内部错误', 500);
  }
};

