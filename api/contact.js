// POST /api/contact - 提交联系表单
const { successResponse, errorResponse, authenticateToken, parseBody, query } = require('./_utils');

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

    const body = parseBody(req);
    const { name, contact, message } = body;

    if (!name || !contact || !message) {
      return errorResponse('请填写所有必填字段', 400);
    }

    await query(
      'INSERT INTO contacts (user_id, name, contact, message) VALUES (?, ?, ?, ?)',
      [authResult.user.id, name, contact, message]
    );

    return successResponse({
      message: '反馈提交成功！我们会尽快回复您。'
    });
  } catch (error) {
    console.error('提交联系表单错误:', error);
    return errorResponse('服务器内部错误', 500);
  }
};

