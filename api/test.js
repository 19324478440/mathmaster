const { successResponse } = require('./_utils');

module.exports = async (req) => {
  return successResponse({ ok: true, message: 'API 测试成功' });
};
