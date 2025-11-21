// 共享工具函数
const jwt = require('jsonwebtoken');
// 延迟加载数据库模块，避免在模块加载时阻塞
// 优先使用 Supabase REST API（如果环境变量已设置），否则使用直接数据库连接
let dbModule = null;
function getDbModule() {
  if (!dbModule) {
    try {
      // 检查是否设置了 Supabase REST API 环境变量
      if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.log('📡 使用 Supabase REST API');
        dbModule = require('../db-supabase-rest');
      } else {
        console.log('🔌 使用直接数据库连接');
        dbModule = require('../db-universal');
      }
    } catch (error) {
      console.error('数据库模块加载失败:', error);
      // 返回占位函数
      return {
        query: async () => { throw new Error('数据库模块未加载'); },
        queryOne: async () => { throw new Error('数据库模块未加载'); }
      };
    }
  }
  return dbModule;
}

const JWT_SECRET = process.env.JWT_SECRET || 'mathmaster_jwt_secret_key_2025';

// CORS 响应头
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

// 成功响应
function successResponse(data, statusCode = 200) {
  return {
    statusCode,
    headers: corsHeaders(),
    body: JSON.stringify(data),
  };
}

// 错误响应
function errorResponse(message, statusCode = 500) {
  return {
    statusCode,
    headers: corsHeaders(),
    body: JSON.stringify({ error: message }),
  };
}

// JWT 认证中间件
function authenticateToken(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return { error: '未提供认证令牌', statusCode: 401 };
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);
    return { user };
  } catch (err) {
    return { error: '无效的认证令牌', statusCode: 403 };
  }
}

// 解析请求体
function parseBody(req) {
  try {
    if (req.body) {
      return typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    }
    return {};
  } catch (error) {
    return {};
  }
}

// 延迟加载的查询函数
const query = async (sql, params) => {
  return getDbModule().query(sql, params);
};

const queryOne = async (sql, params) => {
  return getDbModule().queryOne(sql, params);
};

module.exports = {
  corsHeaders,
  successResponse,
  errorResponse,
  authenticateToken,
  parseBody,
  query,
  queryOne,
  JWT_SECRET,
};

