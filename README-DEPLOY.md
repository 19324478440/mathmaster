# 部署问题排查

如果 Vercel 一直超时，请检查：

## 1. Vercel 项目设置
- Settings > General > Framework Preset: 选择 "Other"
- Settings > General > Build Command: 留空
- Settings > General > Output Directory: 留空
- Settings > General > Install Command: `npm install`

## 2. 查看构建日志
- 进入最新部署
- 查看 "Build Logs"
- 复制所有错误信息

## 3. 环境变量
- Settings > Environment Variables
- 确保设置了数据库相关变量（如果需要）

## 4. 如果还是不行
考虑使用其他平台：
- Netlify
- Railway
- Render（需要信用卡）

