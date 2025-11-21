const mysql = require('mysql2/promise');
const fs = require('fs');

async function init() {
  let conn;
  try {
    console.log('Connecting to MySQL...');
    // Try common passwords or use environment variable
    const password = process.env.DB_PASSWORD || process.argv[2] || '';
    console.log('Attempting connection with password:', password ? '***' : '(empty)');
    
    conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: password
    });
    console.log('✅ MySQL connection successful');
    
    await conn.execute('CREATE DATABASE IF NOT EXISTS mathmaster CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    console.log('✅ Database created');
    
    await conn.changeUser({database: 'mathmaster'});
    console.log('✅ Switched to mathmaster database');
    
    const sql = fs.readFileSync('init.sql', 'utf8');
    await conn.query(sql);
    console.log('✅ Tables created');
    
    await conn.execute(
      'INSERT INTO users (username, password, name, grade, specialty, learning_goal, challenge_direction, completed_levels, notes_count, consecutive_days, points) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE username = username',
      ['demo', 'demo', '演示用户', '高二', '函数与导数', '冲击高考数学145+', '函数综合题、导数应用', 12, 8, 15, 380]
    );
    console.log('✅ Demo user ready (username: demo, password: demo)');
    
    await conn.end();
    console.log('✅ Database initialization complete!');
  } catch (e) {
    console.error('❌ Error:', e.message);
    console.error('Stack:', e.stack);
    if (conn) await conn.end();
    process.exit(1);
  }
}

init();

