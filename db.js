const mysql = require('mysql2/promise');

// 数据库配置（必须使用环境变量，不能硬编码密码）
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '', // 必须通过环境变量设置
  database: process.env.DB_NAME || 'mathmaster',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// 创建连接池
const pool = mysql.createPool(dbConfig);

// 测试数据库连接（带超时）
async function testConnection() {
  return new Promise(async (resolve) => {
    const timeout = setTimeout(() => {
      console.error('❌ MySQL 数据库连接超时（5秒）');
      resolve(false);
    }, 5000);

  try {
    const connection = await pool.getConnection();
      clearTimeout(timeout);
    console.log('✅ MySQL 数据库连接成功！');
    connection.release();
      resolve(true);
  } catch (error) {
      clearTimeout(timeout);
    console.error('❌ MySQL 数据库连接失败:', error.message);
    console.error('请确保：');
    console.error('1. MySQL 服务已启动');
    console.error('2. 数据库已创建（运行 init.sql 脚本）');
    console.error('3. 数据库配置正确（检查 .env 或 db.js）');
      resolve(false);
  }
  });
}

// 执行查询（返回结果）
async function query(sql, params = []) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('数据库查询错误:', error);
    throw error;
  }
}

// 执行查询（返回单个结果）
async function queryOne(sql, params = []) {
  const results = await query(sql, params);
  return results[0] || null;
}

module.exports = {
  pool,
  query,
  queryOne,
  testConnection
};

