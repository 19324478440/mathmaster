// 共享工具函数
const jwt = require('jsonwebtoken');
const { query, queryOne } = require('../db-universal');

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

