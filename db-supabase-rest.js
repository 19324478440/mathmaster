// Supabase REST API 适配器
// 使用 Supabase REST API 替代直接数据库连接，更适合 Serverless Functions

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn('⚠️  Supabase REST API 环境变量未设置，将使用直接数据库连接');
}

// 使用 fetch 调用 Supabase REST API
async function supabaseRequest(table, method = 'GET', filters = {}, data = null) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('Supabase REST API 环境变量未设置');
  }

  let url = `${SUPABASE_URL}/rest/v1/${table}`;
  
  // 构建查询参数
  const queryParams = [];
  if (filters.select) {
    queryParams.push(`select=${filters.select}`);
  }
  if (filters.eq) {
    Object.entries(filters.eq).forEach(([key, value]) => {
      queryParams.push(`${key}=eq.${encodeURIComponent(value)}`);
    });
  }
  if (filters.limit) {
    queryParams.push(`limit=${filters.limit}`);
  }
  if (filters.order) {
    queryParams.push(`order=${filters.order}`);
  }
  
  if (queryParams.length > 0) {
    url += '?' + queryParams.join('&');
  }

  const options = {
    method,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': method === 'POST' ? 'return=representation' : 'return=representation'
    }
  };

  if (data && (method === 'POST' || method === 'PATCH' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Supabase REST API 错误:', response.status, errorText);
      throw new Error(`Supabase API 错误: ${response.status} - ${errorText}`);
    }

    if (method === 'DELETE' || response.status === 204) {
      return [];
    }

    const result = await response.json();
    return Array.isArray(result) ? result : [result];
  } catch (error) {
    console.error('Supabase REST API 请求失败:', error);
    throw error;
  }
}

// 查询函数（兼容 SQL 接口）
async function query(sql, params = []) {
  // 简单的 SQL 解析（仅支持基本查询）
  const sqlUpper = sql.trim().toUpperCase();
  
  // SELECT 查询
  if (sqlUpper.startsWith('SELECT')) {
    // SELECT * FROM users WHERE username = ?
    const match = sql.match(/FROM\s+(\w+)\s+WHERE\s+(\w+)\s*=\s*\?/i);
    if (match) {
      const table = match[1];
      const column = match[2];
      const value = params[0];
      
      const results = await supabaseRequest(table, 'GET', {
        eq: { [column]: value },
        select: '*',
        limit: 1
      });
      
      return results;
    }
    
    // SELECT * FROM users WHERE id = ?
    const matchId = sql.match(/FROM\s+(\w+)\s+WHERE\s+id\s*=\s*\?/i);
    if (matchId) {
      const table = matchId[1];
      const value = params[0];
      
      const results = await supabaseRequest(table, 'GET', {
        eq: { id: value },
        select: '*',
        limit: 1
      });
      
      return results;
    }
    
    // SELECT * FROM notes ORDER BY created_at DESC
    const matchNotes = sql.match(/FROM\s+(\w+)\s+ORDER\s+BY\s+(\w+)\s+(DESC|ASC)/i);
    if (matchNotes) {
      const table = matchNotes[1];
      const orderColumn = matchNotes[2];
      const orderDirection = matchNotes[3].toLowerCase();
      
      const results = await supabaseRequest(table, 'GET', {
        select: '*',
        order: `${orderColumn}.${orderDirection}`
      });
      
      return results;
    }
    
    // SELECT * FROM user_progress WHERE user_id = ?
    const matchProgress = sql.match(/FROM\s+(\w+)\s+WHERE\s+user_id\s*=\s*\?/i);
    if (matchProgress) {
      const table = matchProgress[1];
      const value = params[0];
      
      const results = await supabaseRequest(table, 'GET', {
        eq: { user_id: value },
        select: '*'
      });
      
      return results;
    }
    
    // SELECT 1 (健康检查)
    if (sqlUpper.includes('SELECT 1')) {
      return [{ '?column?': 1 }];
    }
    
    // 默认：尝试从表名获取所有数据
    const tableMatch = sql.match(/FROM\s+(\w+)/i);
    if (tableMatch) {
      const table = tableMatch[1];
      const results = await supabaseRequest(table, 'GET', {
        select: '*'
      });
      return results;
    }
  }
  
  // INSERT 查询
  if (sqlUpper.startsWith('INSERT')) {
    const match = sql.match(/INTO\s+(\w+)\s*\(([^)]+)\)\s*VALUES/i);
    if (match) {
      const table = match[1];
      const columns = match[2].split(',').map(c => c.trim());
      
      const data = {};
      columns.forEach((col, index) => {
        data[col] = params[index];
      });
      
      const results = await supabaseRequest(table, 'POST', {}, data);
      
      // 返回类似 MySQL 的格式
      if (results.length > 0 && results[0].id) {
        return { insertId: results[0].id, ...results };
      }
      return results;
    }
  }
  
  // UPDATE 查询
  if (sqlUpper.startsWith('UPDATE')) {
    const match = sql.match(/UPDATE\s+(\w+)\s+SET\s+([^W]+)\s+WHERE\s+(\w+)\s*=\s*\?/i);
    if (match) {
      const table = match[1];
      const setClause = match[2];
      const whereColumn = match[3];
      const whereValue = params[params.length - 1];
      
      // 解析 SET 子句
      const updates = {};
      const setParts = setClause.split(',');
      setParts.forEach((part, index) => {
        const [key, value] = part.split('=').map(s => s.trim());
        updates[key] = params[index] !== undefined ? params[index] : value.replace(/['"]/g, '');
      });
      
      const results = await supabaseRequest(table, 'PATCH', {
        eq: { [whereColumn]: whereValue }
      }, updates);
      
      return results;
    }
  }
  
  throw new Error(`不支持的 SQL 查询: ${sql}`);
}

// 查询单条记录
async function queryOne(sql, params = []) {
  const results = await query(sql, params);
  return results[0] || null;
}

// 测试连接
async function testConnection() {
  try {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return false;
    }
    // 尝试查询一个简单的表
    await supabaseRequest('users', 'GET', { limit: 1 });
    return true;
  } catch (error) {
    console.error('Supabase REST API 连接测试失败:', error);
    return false;
  }
}

module.exports = {
  query,
  queryOne,
  testConnection,
  supabaseRequest // 导出原始请求函数供高级用法
};

