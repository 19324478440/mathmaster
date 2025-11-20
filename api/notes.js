// GET /api/notes - 获取心得列表
const { successResponse, errorResponse, authenticateToken, query } = require('./_utils');

module.exports = async (req) => {
  if (req.method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    };
  }

  if (req.method !== 'GET') {
    return errorResponse('方法不允许', 405);
  }

  try {
    // 验证 token
    const authResult = authenticateToken(req);
    if (authResult.error) {
      return errorResponse(authResult.error, authResult.statusCode);
    }

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
      createdAt: note.createdAt ? new Date(note.createdAt).toISOString() : null
    }));

    return successResponse(formattedNotes);
  } catch (error) {
    console.error('获取心得列表错误:', error);
    return errorResponse('服务器内部错误', 500);
  }
};

