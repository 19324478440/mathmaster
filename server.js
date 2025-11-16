const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const { query, queryOne, testConnection } = require('./db');

const app = express();
// 支持 Render 等平台的端口配置
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'mathmaster_jwt_secret_key_2025';

// 中间件配置
app.use(cors());
app.use(express.json());

// API 路由（必须在静态文件服务之前）

// JWT 认证中间件
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: '未提供认证令牌' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: '无效的认证令牌' });
    }
    req.user = user;
    next();
  });
}

// API 路由

// POST /api/register - 用户注册
app.post('/api/register', async (req, res) => {
  console.log('注册请求收到:', { username: req.body.username, hasPassword: !!req.body.password });
  try {
    const { username, password, name, grade, specialty, learning_goal, challenge_direction } = req.body;

    // 验证必填字段
    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码不能为空' });
    }

    // 检查用户名长度
    if (username.length < 3 || username.length > 20) {
      return res.status(400).json({ error: '用户名长度必须在3-20个字符之间' });
    }

    // 检查密码长度
    if (password.length < 6) {
      return res.status(400).json({ error: '密码长度不能少于6个字符' });
    }

    // 检查用户名是否已存在
    const existingUser = await queryOne(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );

    if (existingUser) {
      return res.status(400).json({ error: '用户名已存在，请选择其他用户名' });
    }

    // 插入新用户
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
    const newUser = await queryOne(
      'SELECT id, username, name, grade, specialty, learning_goal, challenge_direction, completed_levels, notes_count, consecutive_days, points FROM users WHERE id = ?',
      [result.insertId]
    );

    // 生成JWT token
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 返回用户信息（不包含密码）
    res.json({
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
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// POST /api/login - 用户登录
app.post('/api/login', async (req, res) => {
  console.log('登录请求收到:', { username: req.body.username, hasPassword: !!req.body.password });
  try {
    const { username, password } = req.body;

    // 查询用户
    const user = await queryOne(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (!user) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    // 支持快速体验（demo用户）或验证密码
    if (username === 'demo' && (!password || password === 'demo')) {
      // demo用户直接通过
    } else {
      // 验证密码（必须提供密码且密码匹配）
      if (!password) {
        return res.status(401).json({ error: '请输入密码' });
      }
      if (user.password !== password) {
        return res.status(401).json({ error: '用户名或密码错误' });
      }
    }

    // 生成JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 返回用户信息（不包含密码）
    res.json({
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
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// GET /api/user - 获取用户信息
app.get('/api/user', authenticateToken, async (req, res) => {
  try {
    const user = await queryOne(
      'SELECT id, username, name, grade, specialty, learning_goal, challenge_direction, completed_levels, notes_count, consecutive_days, points FROM users WHERE id = ?',
      [req.user.id]
    );

    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    res.json({
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
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// GET /api/progress - 获取学习进度
app.get('/api/progress', authenticateToken, async (req, res) => {
  try {
    const progressRows = await query(
      'SELECT theme, level, completed FROM user_progress WHERE user_id = ? ORDER BY theme, level',
      [req.user.id]
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

    res.json(progress);
  } catch (error) {
    console.error('获取进度错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// POST /api/progress/update - 更新关卡进度
app.post('/api/progress/update', authenticateToken, async (req, res) => {
  try {
    const { theme, level } = req.body;

    if (!theme || !level) {
      return res.status(400).json({ error: '缺少必要参数：theme 和 level' });
    }

    // 插入或更新进度
    await query(
      `INSERT INTO user_progress (user_id, theme, level, completed, completed_at) 
       VALUES (?, ?, ?, TRUE, NOW()) 
       ON DUPLICATE KEY UPDATE completed = TRUE, completed_at = NOW()`,
      [req.user.id, theme, level]
    );

    // 重新计算完成的关卡数
    const completedCount = await queryOne(
      'SELECT COUNT(*) as count FROM user_progress WHERE user_id = ? AND completed = TRUE',
      [req.user.id]
    );

    // 获取用户信息以计算积分
    const user = await queryOne(
      'SELECT consecutive_days FROM users WHERE id = ?',
      [req.user.id]
    );

    const points = (completedCount.count * 10) + (user.consecutive_days * 5);

    // 更新用户统计信息
    await query(
      'UPDATE users SET completed_levels = ?, points = ? WHERE id = ?',
      [completedCount.count, points, req.user.id]
    );

    // 返回更新后的进度
    const progressRows = await query(
      'SELECT theme, level, completed FROM user_progress WHERE user_id = ? ORDER BY theme, level',
      [req.user.id]
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
      [req.user.id]
    );

    res.json({
      message: '进度更新成功',
      progress: progress,
      statistics: {
        completed_levels: updatedUser.completed_levels,
        points: updatedUser.points
      }
    });
  } catch (error) {
    console.error('更新进度错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// POST /api/checkin - 每日打卡
app.post('/api/checkin', authenticateToken, async (req, res) => {
  try {
    const user = await queryOne(
      'SELECT id, last_checkin, consecutive_days, points FROM users WHERE id = ?',
      [req.user.id]
    );

    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    const today = new Date().toISOString().split('T')[0];
    const lastCheckin = user.last_checkin ? new Date(user.last_checkin).toISOString().split('T')[0] : null;

    if (lastCheckin === today) {
      return res.json({
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

    // 更新数据库
    await query(
      'UPDATE users SET last_checkin = CURDATE(), consecutive_days = ?, points = ? WHERE id = ?',
      [newConsecutiveDays, newPoints, req.user.id]
    );

    res.json({
      message: '打卡成功！获得10积分',
      consecutive_days: newConsecutiveDays,
      points: newPoints
    });
  } catch (error) {
    console.error('打卡错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// GET /api/notes - 获取心得列表
app.get('/api/notes', authenticateToken, async (req, res) => {
  try {
    const notes = await query(
      'SELECT id, title, content, type, likes, comments_count, name, created_at as createdAt FROM notes ORDER BY created_at DESC'
    );

    // 转换日期格式
    const formattedNotes = notes.map(note => ({
      id: note.id,
      title: note.title,
      content: note.content,
      type: note.type,
      likes: note.likes,
      comments_count: note.comments_count,
      name: note.name,
      createdAt: note.createdAt.toISOString()
    }));

    res.json(formattedNotes);
  } catch (error) {
    console.error('获取心得列表错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// POST /api/notes/:id/like - 点赞心得
app.post('/api/notes/:id/like', authenticateToken, async (req, res) => {
  try {
    const noteId = parseInt(req.params.id);

    // 更新点赞数
    await query(
      'UPDATE notes SET likes = likes + 1 WHERE id = ?',
      [noteId]
    );

    // 获取更新后的点赞数
    const note = await queryOne(
      'SELECT likes FROM notes WHERE id = ?',
      [noteId]
    );

    if (!note) {
      return res.status(404).json({ error: '心得不存在' });
    }

    res.json({
      message: '点赞成功',
      likes: note.likes
    });
  } catch (error) {
    console.error('点赞错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// POST /api/contact - 提交联系表单
app.post('/api/contact', authenticateToken, async (req, res) => {
  try {
    const { name, contact, message } = req.body;

    if (!name || !contact || !message) {
      return res.status(400).json({ error: '请填写所有必填字段' });
    }

    await query(
      'INSERT INTO contacts (user_id, name, contact, message) VALUES (?, ?, ?, ?)',
      [req.user.id, name, contact, message]
    );

    res.json({
      message: '反馈提交成功！我们会尽快回复您。'
    });
  } catch (error) {
    console.error('提交联系表单错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 健康检查端点
app.get('/api/health', async (req, res) => {
  try {
    // 测试数据库连接
    await query('SELECT 1');
    res.json({
      status: 'healthy',
      message: 'MathMaster API 服务运行正常',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      message: '数据库连接失败',
      database: 'disconnected',
      timestamp: new Date().toISOString()
    });
  }
});

// 静态文件服务（必须在API路由之后）
app.use(express.static(__dirname));

// 处理根路径，返回 index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({ error: '接口不存在' });
});

// 启动服务器
async function startServer() {
  // 测试数据库连接
  const dbConnected = await testConnection();
  
  if (!dbConnected) {
    console.error('\n❌ 数据库连接失败，服务器无法启动！');
    console.error('请先：');
    console.error('1. 确保 MySQL 服务已启动');
    console.error('2. 运行 init.sql 脚本初始化数据库');
    console.error('3. 检查 db.js 中的数据库配置\n');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log('========================================');
    console.log('MathMaster 后端服务器启动成功！');
    console.log(`服务器运行在: http://localhost:${PORT}`);
    console.log('========================================');
    console.log('API 端点列表：');
    console.log('  ✅ POST   /api/register           - 用户注册 (已启用)');
    console.log('  POST   /api/login              - 用户登录');
    console.log('  GET    /api/user               - 获取用户信息');
    console.log('  GET    /api/progress           - 获取学习进度');
    console.log('  POST   /api/progress/update    - 更新关卡进度');
    console.log('  POST   /api/checkin            - 每日打卡');
    console.log('  GET    /api/notes              - 获取心得列表');
    console.log('  POST   /api/notes/:id/like     - 点赞心得');
    console.log('  POST   /api/contact            - 提交联系表单');
    console.log('  GET    /api/health             - 健康检查');
    console.log('========================================');
    console.log('提示：可以直接访问 http://localhost:3000 查看网站');
    console.log('========================================');
  });
}

startServer();
