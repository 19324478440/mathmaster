// POST /api/notes/:id/like - 点赞心得
const { successResponse, errorResponse, authenticateToken, query, queryOne } = require('../../_utils');

module.exports = async (req) => {
  if (req.method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    };
  }

  if (req.method !== 'POST') {
    return errorResponse('方法不允许', 405);
  }

  try {
    // 验证 token
    const authResult = authenticateToken(req);
    if (authResult.error) {
      return errorResponse(authResult.error, authResult.statusCode);
    }

    // 从 URL 路径中获取 id
    // Vercel 会将路径参数放在 req.query 或需要从 URL 解析
    let noteId;
    if (req.query && req.query.id) {
      noteId = parseInt(req.query.id);
    } else if (req.url) {
      // 从 URL 路径解析：/api/notes/123/like
      const match = req.url.match(/\/notes\/(\d+)\/like/);
      noteId = match ? parseInt(match[1]) : null;
    }

    if (!noteId || isNaN(noteId)) {
      return errorResponse('无效的心得ID', 400);
    }

    // 更新点赞数
    await query(
      'UPDATE notes SET likes = likes + 1 WHERE id = ?',
      [noteId]
    );

    // 获取更新后的点赞数
    const note = await queryOne(
      'SELECT likes FROM notes WHERE id = ?',
      [noteId]
    );

    if (!note) {
      return errorResponse('心得不存在', 404);
    }

    return successResponse({
      message: '点赞成功',
      likes: note.likes
    });
  } catch (error) {
    console.error('点赞错误:', error);
    return errorResponse('服务器内部错误', 500);
  }
};

