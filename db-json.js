// 简单的 JSON 文件数据库（临时方案，无需 MySQL）
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data.json');

// 初始化数据库文件
function initDB() {
  if (!fs.existsSync(dbPath)) {
    const initialData = {
      users: [
        {
          id: 1,
          username: 'demo',
          password: 'demo',
          name: '演示用户',
          grade: '高二',
          specialty: '函数与导数',
          learning_goal: '冲击高考数学145+',
          challenge_direction: '函数综合题、导数应用',
          completed_levels: 12,
          notes_count: 8,
          consecutive_days: 15,
          points: 380
        }
      ],
      user_progress: [],
      notes: [],
      contacts: []
    };
    fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2), 'utf8');
    console.log('✅ JSON 数据库已初始化');
  }
}

// 读取数据库
function readDB() {
  initDB();
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
}

// 写入数据库
function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
}

// 查询函数
async function query(sql, params = []) {
  const db = readDB();
  
  // 简单的 SQL 解析（仅支持基本查询）
  if (sql.includes('SELECT * FROM users WHERE username = ?')) {
    const username = params[0];
    const user = db.users.find(u => u.username === username);
    return user ? [user] : [];
  }
  
  if (sql.includes('SELECT * FROM users WHERE id = ?')) {
    const id = params[0];
    const user = db.users.find(u => u.id === id);
    return user ? [user] : [];
  }
  
  if (sql.includes('SELECT * FROM user_progress WHERE user_id = ?')) {
    const userId = params[0];
    return db.user_progress.filter(p => p.user_id === userId);
  }
  
  if (sql.includes('SELECT * FROM notes')) {
    return db.notes;
  }
  
  if (sql.includes('INSERT INTO users')) {
    const newUser = {
      id: db.users.length > 0 ? Math.max(...db.users.map(u => u.id)) + 1 : 1,
      username: params[0],
      password: params[1],
      name: params[2] || null,
      grade: params[3] || null,
      specialty: params[4] || null,
      learning_goal: params[5] || null,
      challenge_direction: params[6] || null,
      completed_levels: 0,
      notes_count: 0,
      consecutive_days: 0,
      points: 0
    };
    db.users.push(newUser);
    writeDB(db);
    return { insertId: newUser.id };
  }
  
  if (sql.includes('INSERT INTO user_progress')) {
    const progress = {
      id: db.user_progress.length > 0 ? Math.max(...db.user_progress.map(p => p.id)) + 1 : 1,
      user_id: params[0],
      theme: params[1],
      level: params[2],
      completed: true,
      completed_at: new Date().toISOString()
    };
    // 检查是否已存在
    const existing = db.user_progress.find(p => 
      p.user_id === progress.user_id && 
      p.theme === progress.theme && 
      p.level === progress.level
    );
    if (!existing) {
      db.user_progress.push(progress);
      writeDB(db);
    }
    return { insertId: progress.id };
  }
  
  if (sql.includes('INSERT INTO notes')) {
    const note = {
      id: db.notes.length > 0 ? Math.max(...db.notes.map(n => n.id)) + 1 : 1,
      title: params[0],
      content: params[1],
      type: params[2] || null,
      name: params[3] || null,
      username: params[3] || null,
      likes: 0,
      comments_count: 0,
      createdAt: new Date().toISOString()
    };
    db.notes.push(note);
    writeDB(db);
    return { insertId: note.id };
  }
  
  if (sql.includes('UPDATE users SET')) {
    const userId = params[params.length - 1]; // 最后一个参数通常是 WHERE 条件
    const user = db.users.find(u => u.id === userId);
    if (user) {
      // 更新用户信息
      if (sql.includes('consecutive_days')) {
        user.consecutive_days = params[0];
        user.last_checkin = new Date().toISOString().split('T')[0];
      }
      writeDB(db);
    }
    return { affectedRows: user ? 1 : 0 };
  }
  
  if (sql.includes('UPDATE notes SET likes')) {
    const noteId = params[0];
    const note = db.notes.find(n => n.id === noteId);
    if (note) {
      note.likes = (note.likes || 0) + 1;
      writeDB(db);
    }
    return { affectedRows: note ? 1 : 0 };
  }
  
  if (sql.includes('INSERT INTO contacts')) {
    const contact = {
      id: db.contacts.length > 0 ? Math.max(...db.contacts.map(c => c.id)) + 1 : 1,
      user_id: params[0] || null,
      name: params[1],
      contact: params[2],
      message: params[3],
      created_at: new Date().toISOString()
    };
    db.contacts.push(contact);
    writeDB(db);
    return { insertId: contact.id };
  }
  
  return [];
}

async function queryOne(sql, params = []) {
  const results = await query(sql, params);
  return results[0] || null;
}

async function testConnection() {
  initDB();
  return true;
}

module.exports = {
  pool: null,
  query,
  queryOne,
  testConnection
};

