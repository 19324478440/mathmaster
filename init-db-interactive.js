const mysql = require('mysql2/promise');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function tryConnect(password) {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: password || ''
    });
    await conn.end();
    return true;
  } catch (e) {
    return false;
  }
}

async function init() {
  let conn;
  let password = '';
  
  console.log('正在尝试连接 MySQL...');
  
  // 尝试空密码
  if (await tryConnect('')) {
    console.log('✅ 使用空密码连接成功');
    password = '';
  } else {
    console.log('❌ 空密码连接失败');
    console.log('请提供 MySQL root 密码：');
    password = await question('密码（直接回车跳过，将尝试常见密码）: ');
    
    if (!password) {
      // 尝试常见密码
      const commonPasswords = ['root', '123456', 'password', 'admin'];
      console.log('尝试常见密码...');
      for (const pwd of commonPasswords) {
        if (await tryConnect(pwd)) {
          console.log(`✅ 使用密码 "${pwd}" 连接成功`);
          password = pwd;
          break;
        }
      }
    }
    
    if (!password || !(await tryConnect(password))) {
      console.log('❌ 无法连接 MySQL。请：');
      console.log('1. 确认 MySQL 服务正在运行');
      console.log('2. 使用正确的 root 密码');
      console.log('3. 或运行: node init-db.js 你的密码');
      rl.close();
      process.exit(1);
    }
  }
  
  try {
    console.log('正在连接 MySQL...');
    conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: password
    });
    console.log('✅ MySQL 连接成功');
    
    await conn.execute('CREATE DATABASE IF NOT EXISTS mathmaster CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    console.log('✅ 数据库已创建');
    
    await conn.changeUser({database: 'mathmaster'});
    console.log('✅ 已切换到 mathmaster 数据库');
    
    const sql = fs.readFileSync('init.sql', 'utf8');
    await conn.query(sql);
    console.log('✅ 表已创建');
    
    await conn.execute(
      'INSERT INTO users (username, password, name, grade, specialty, learning_goal, challenge_direction, completed_levels, notes_count, consecutive_days, points) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE username = username',
      ['demo', 'demo', '演示用户', '高二', '函数与导数', '冲击高考数学145+', '函数综合题、导数应用', 12, 8, 15, 380]
    );
    console.log('✅ Demo 用户已就绪 (用户名: demo, 密码: demo)');
    
    await conn.end();
    console.log('\n✅ 数据库初始化完成！');
    console.log('现在可以运行: npm start');
    rl.close();
  } catch (e) {
    console.error('❌ 错误:', e.message);
    if (conn) await conn.end();
    rl.close();
    process.exit(1);
  }
}

init();

