// 自动部署脚本
const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 开始自动部署流程...\n');

// 检查是否已登录 Vercel
try {
  console.log('📋 检查 Vercel 登录状态...');
  execSync('vercel whoami', { stdio: 'pipe' });
  console.log('✅ 已登录 Vercel\n');
} catch (e) {
  console.log('⚠️  未登录 Vercel，请先登录：');
  console.log('   运行: vercel login');
  console.log('   然后在浏览器中完成登录\n');
  process.exit(1);
}

// 检查环境变量
console.log('🔍 检查环境变量配置...');
const requiredEnvVars = ['DB_TYPE', 'DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET'];
const missingVars = [];

// 尝试从 .env 文件读取
if (fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf8');
  requiredEnvVars.forEach(varName => {
    if (!envContent.includes(varName)) {
      missingVars.push(varName);
    }
  });
} else {
  console.log('⚠️  未找到 .env 文件');
  console.log('   环境变量需要在 Vercel Dashboard 中配置\n');
}

if (missingVars.length > 0) {
  console.log('⚠️  缺少以下环境变量:');
  missingVars.forEach(v => console.log(`   - ${v}`));
  console.log('\n💡 请先在 Vercel Dashboard 中配置环境变量：');
  console.log('   1. 访问 https://vercel.com');
  console.log('   2. 选择你的项目');
  console.log('   3. Settings > Environment Variables');
  console.log('   4. 添加所需的变量\n');
  console.log('   或者使用 Railway 自动部署（推荐）：');
  console.log('   https://railway.app\n');
  process.exit(1);
}

// 部署
console.log('📦 开始部署到 Vercel...\n');
try {
  execSync('vercel --prod', { stdio: 'inherit' });
  console.log('\n✅ 部署完成！');
} catch (e) {
  console.error('\n❌ 部署失败:', e.message);
  process.exit(1);
}

