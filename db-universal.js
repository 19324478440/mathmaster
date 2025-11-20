// 通用数据库适配器 - 支持 MySQL 和 PostgreSQL
const DB_TYPE = process.env.DB_TYPE || (process.env.DB_HOST && process.env.DB_HOST.includes('postgres') ? 'postgres' : 'mysql');

let pool, query, queryOne, testConnection;

if (DB_TYPE === 'postgres') {
  // PostgreSQL 配置
  const { Pool: PgPool } = require('pg');
  const pgPool = new PgPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    max: 2
  });

  pool = pgPool;

  // 转换 MySQL 占位符 ? 为 PostgreSQL 占位符 $1, $2, ...
  function convertQuery(sql, params = []) {
    let paramIndex = 1;
    const convertedSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
    return { sql: convertedSql, params };
  }

  query = async (sql, params = []) => {
    try {
      const { sql: convertedSql, params: convertedParams } = convertQuery(sql, params);
      // 添加超时保护（5秒）
      const result = await Promise.race([
        pgPool.query(convertedSql, convertedParams),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('数据库查询超时')), 5000)
        )
      ]);
      // PostgreSQL 返回 result.rows，需要添加 insertId 兼容性
      const rows = result.rows || [];
      // 如果查询包含 RETURNING id，提取 id 作为 insertId
      if (sql.toUpperCase().includes('RETURNING') && rows.length > 0 && rows[0].id) {
        rows.insertId = rows[0].id;
      }
      return rows;
    } catch (error) {
      console.error('PostgreSQL 查询错误:', error);
      throw error;
    }
  };

  queryOne = async (sql, params = []) => {
    const results = await query(sql, params);
    return results[0] || null;
  };

  testConnection = async () => {
    return new Promise(async (resolve) => {
      const timeout = setTimeout(() => {
        console.error('❌ PostgreSQL 数据库连接超时（5秒）');
        resolve(false);
      }, 5000);

      try {
        await pgPool.query('SELECT NOW()');
        clearTimeout(timeout);
        console.log('✅ PostgreSQL 数据库连接成功！');
        resolve(true);
      } catch (error) {
        clearTimeout(timeout);
        console.error('❌ PostgreSQL 数据库连接失败:', error.message);
        resolve(false);
      }
    });
  };
} else {
  // MySQL 配置
  const mysql = require('mysql2/promise');
  const mysqlPool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'mathmaster',
    waitForConnections: true,
    connectionLimit: 2,
    queueLimit: 0,
    connectTimeout: 5000
  });

  pool = mysqlPool;

  query = async (sql, params = []) => {
    try {
      // 添加超时保护（5秒）
      const [results] = await Promise.race([
        mysqlPool.execute(sql, params),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('数据库查询超时')), 5000)
        )
      ]);
      // MySQL 返回 [results, fields]，需要添加 insertId
      if (results.insertId !== undefined) {
        return results;
      }
      return results;
    } catch (error) {
      console.error('MySQL 查询错误:', error);
      throw error;
    }
  };

  queryOne = async (sql, params = []) => {
    const results = await query(sql, params);
    return results[0] || null;
  };

  testConnection = async () => {
    return new Promise(async (resolve) => {
      const timeout = setTimeout(() => {
        console.error('❌ MySQL 数据库连接超时（5秒）');
        resolve(false);
      }, 5000);

      try {
        const connection = await mysqlPool.getConnection();
        clearTimeout(timeout);
        console.log('✅ MySQL 数据库连接成功！');
        connection.release();
        resolve(true);
      } catch (error) {
        clearTimeout(timeout);
        console.error('❌ MySQL 数据库连接失败:', error.message);
        resolve(false);
      }
    });
  };
}

module.exports = {
  pool,
  query,
  queryOne,
  testConnection
};

