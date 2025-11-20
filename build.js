// 构建脚本：确保 public 目录存在
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const files = ['index.html', 'style.css', 'app.js'];

// 确保 public 目录存在
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 复制文件到 public 目录
files.forEach(file => {
  const src = path.join(__dirname, file);
  const dest = path.join(publicDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${file} to public/`);
  }
});

console.log('Build complete!');

