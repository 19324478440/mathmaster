// POST /api/login - 用户登录
const jwt = require('jsonwebtoken');
const { successResponse, errorResponse, parseBody, queryOne, JWT_SECRET } = require('./_utils');

module.exports = async (req) => {
  if (req.method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    };
  }

  if (req.method !== 'POST') {
    return errorResponse('方法不允许', 405);
  }

  try {
    const body = parseBody(req);
    const { username, password } = body;

    console.log('登录请求收到:', { username, hasPassword: !!password });

    // 查询用户
    const user = await queryOne(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (!user) {
      return errorResponse('用户名或密码错误', 401);
    }

    // 支持快速体验（demo用户）或验证密码
    if (username === 'demo' && (!password || password === 'demo')) {
      // demo用户直接通过
    } else {
      // 验证密码（必须提供密码且密码匹配）
      if (!password) {
        return errorResponse('请输入密码', 401);
      }
      if (user.password !== password) {
        return errorResponse('用户名或密码错误', 401);
      }
    }

    // 生成JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 返回用户信息（不包含密码）
    return successResponse({
      token,
      user: {
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
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    return errorResponse('服务器内部错误', 500);
  }
};

