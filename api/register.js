// POST /api/register - 用户注册
const jwt = require('jsonwebtoken');
const { successResponse, errorResponse, parseBody, query, queryOne, JWT_SECRET } = require('./_utils');

module.exports = async (req) => {
  // 处理 OPTIONS 请求（CORS 预检）
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
    const { username, password, name, grade, specialty, learning_goal, challenge_direction } = body;

    console.log('注册请求收到:', { username, hasPassword: !!password });

    // 验证必填字段
    if (!username || !password) {
      return errorResponse('用户名和密码不能为空', 400);
    }

    // 检查用户名长度
    if (username.length < 3 || username.length > 20) {
      return errorResponse('用户名长度必须在3-20个字符之间', 400);
    }

    // 检查密码长度
    if (password.length < 6) {
      return errorResponse('密码长度不能少于6个字符', 400);
    }

    // 检查用户名是否已存在
    const existingUser = await queryOne(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );

    if (existingUser) {
      return errorResponse('用户名已存在，请选择其他用户名', 400);
    }

    // 插入新用户（兼容 MySQL 和 PostgreSQL）
    const isPostgres = process.env.DB_TYPE === 'postgres' || (process.env.DB_HOST && process.env.DB_HOST.includes('postgres'));
    let newUser;
    
    if (isPostgres) {
      // PostgreSQL 使用 RETURNING 子句
      newUser = await queryOne(
        `INSERT INTO users (username, password, name, grade, specialty, learning_goal, challenge_direction, completed_levels, notes_count, consecutive_days, points, created_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, 0, 0, 0, 0, CURRENT_TIMESTAMP) 
         RETURNING id, username, name, grade, specialty, learning_goal, challenge_direction, completed_levels, notes_count, consecutive_days, points`,
        [
          username,
          password,
          name || username,
          grade || null,
          specialty || null,
          learning_goal || null,
          challenge_direction || null
        ]
      );
    } else {
      // MySQL 使用传统方式
      const result = await query(
        `INSERT INTO users (username, password, name, grade, specialty, learning_goal, challenge_direction, completed_levels, notes_count, consecutive_days, points, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, 0, 0, NOW())`,
        [
          username,
          password,
          name || username,
          grade || null,
          specialty || null,
          learning_goal || null,
          challenge_direction || null
        ]
      );
      // 获取新创建的用户
      newUser = await queryOne(
        'SELECT id, username, name, grade, specialty, learning_goal, challenge_direction, completed_levels, notes_count, consecutive_days, points FROM users WHERE id = ?',
        [result.insertId]
      );
    }

    // 生成JWT token
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 返回用户信息（不包含密码）
    return successResponse({
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        name: newUser.name,
        grade: newUser.grade,
        specialty: newUser.specialty,
        learning_goal: newUser.learning_goal,
        challenge_direction: newUser.challenge_direction,
        statistics: {
          completed_levels: newUser.completed_levels,
          notes_count: newUser.notes_count,
          consecutive_days: newUser.consecutive_days,
          points: newUser.points
        }
      }
    });
  } catch (error) {
    console.error('注册错误:', error);
    return errorResponse('服务器内部错误', 500);
  }
};

