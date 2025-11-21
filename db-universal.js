// 通用数据库适配器 - 支持 MySQL, PostgreSQL, SQLite 和 JSON
// 完全延迟初始化，避免在模块加载时阻塞（Vercel Serverless Functions 要求）
const fs = require('fs');
const path = require('path');

const DB_TYPE = process.env.DB_TYPE || 'mysql';

let pool, query, queryOne, testConnection;
let poolInitialized = false;

// 延迟初始化连接池（只在第一次查询时调用）
function initPool() {
  if (poolInitialized) return;
  poolInitialized = true;

  if (DB_TYPE === 'postgres') {
    // PostgreSQL 配置
    const { Pool: PgPool } = require('pg');
    
    // 只有在环境变量存在时才创建连接池
    if (process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASSWORD) {
      const pgPool = new PgPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'postgres',
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
      // 环境变量未设置，创建空的占位函数
      pool = null;
      query = async () => { throw new Error('数据库环境变量未设置'); };
      queryOne = async () => { throw new Error('数据库环境变量未设置'); };
      testConnection = async () => false;
    }
  } else if (DB_TYPE === 'mysql') {
    // MySQL 配置
    const mysql = require('mysql2/promise');
    const dbPassword = process.env.DB_PASSWORD || '';
    
    if (!dbPassword) {
      console.log('⚠️  警告: 未设置 DB_PASSWORD 环境变量，将使用空密码');
    }
    
    const mysqlPool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: dbPassword,
      database: process.env.DB_NAME || 'mathmaster',
      waitForConnections: true,
      connectionLimit: 2,
      queueLimit: 0,
      connectTimeout: 5000
    });
    
    console.log(`✅ MySQL 连接池已创建 (host: ${process.env.DB_HOST || 'localhost'}, user: ${process.env.DB_USER || 'root'}, database: ${process.env.DB_NAME || 'mathmaster'}, password: ${dbPassword ? '***' : '(空)'})`);

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
  } else if (DB_TYPE === 'sqlite') {
    // SQLite for local dev
    const sqlite3 = require('sqlite3').verbose();
    const dbPath = path.join(__dirname, 'mathmaster.db');
    
    if (!fs.existsSync(dbPath)) {
      console.log('Creating SQLite database...');
    }
    
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('SQLite error:', err);
      } else {
        console.log('✅ SQLite database connected');
      }
    });
    
    db.serialize(() => {
      const initSql = fs.readFileSync('init.sql', 'utf8');
      const adaptedSql = initSql
        .replace(/ENGINE=InnoDB DEFAULT CHARSET=utf8mb4/g, '')
        .replace(/AUTO_INCREMENT/g, 'AUTOINCREMENT')
        .replace(/CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci/g, '')
        .replace(/ON UPDATE CURRENT_TIMESTAMP/g, '')
        .replace(/TIMESTAMP DEFAULT CURRENT_TIMESTAMP/g, 'DATETIME DEFAULT (datetime("now"))')
        .replace(/FOREIGN KEY \(user_id\) REFERENCES users\(id\) ON DELETE CASCADE/g, 'FOREIGN KEY (user_id) REFERENCES users(id)')
        .replace(/FOREIGN KEY \(user_id\) REFERENCES users\(id\) ON DELETE SET NULL/g, 'FOREIGN KEY (user_id) REFERENCES users(id)')
        .replace(/UNIQUE KEY unique_user_progress \(user_id, theme, level\)/g, 'UNIQUE (user_id, theme, level)');
      
      db.exec(adaptedSql, (err) => {
        if (err) {
          console.error('SQLite init error:', err);
        } else {
          console.log('✅ SQLite tables created');
        }
      });
    });

    query = async (sql, params = []) => {
      return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
          if (err) {
            console.error('SQLite query error:', err);
            reject(err);
          } else {
            if (sql.trim().toUpperCase().startsWith('INSERT')) {
              rows.insertId = db.lastID;
            }
            resolve(rows);
          }
        });
      });
    };

    queryOne = async (sql, params = []) => {
      return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
          if (err) {
            console.error('SQLite queryOne error:', err);
            reject(err);
          } else {
            resolve(row || null);
          }
        });
      });
    };

    testConnection = async () => {
      return new Promise((resolve) => {
        db.get('SELECT 1', (err) => {
          if (err) {
            console.error('❌ SQLite connection failed');
            resolve(false);
          } else {
            console.log('✅ SQLite connection successful');
            resolve(true);
          }
        });
      });
    };

    pool = db;
  } else if (DB_TYPE === 'json') {
    // JSON 文件数据库（最简单，无需配置）
    const jsonDb = require('./db-json');
    pool = null;
    query = jsonDb.query;
    queryOne = jsonDb.queryOne;
    testConnection = jsonDb.testConnection;
    console.log('✅ 使用 JSON 文件数据库（无需 MySQL 配置）');
  }
}

// 延迟加载的查询函数（只在第一次调用时初始化）
const lazyQuery = async (sql, params) => {
  if (!poolInitialized) initPool();
  return query(sql, params);
};

const lazyQueryOne = async (sql, params) => {
  if (!poolInitialized) initPool();
  return queryOne(sql, params);
};

const lazyTestConnection = async () => {
  if (!poolInitialized) initPool();
  return testConnection();
};

module.exports = {
  pool: null, // 不导出 pool，避免在模块加载时初始化
  query: lazyQuery,
  queryOne: lazyQueryOne,
  testConnection: lazyTestConnection
};
