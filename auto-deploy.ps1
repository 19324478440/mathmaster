# 自动部署脚本
Write-Host "🚀 MathMaster 自动部署脚本" -ForegroundColor Green
Write-Host ""

# 检查 Vercel CLI
Write-Host "📋 检查 Vercel CLI..." -ForegroundColor Yellow
try {
    $vercelVersion = vercel --version 2>&1
    Write-Host "✅ Vercel CLI 已安装: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI 未安装，正在安装..." -ForegroundColor Red
    npm install -g vercel
}

Write-Host ""

# 检查登录状态
Write-Host "🔐 检查 Vercel 登录状态..." -ForegroundColor Yellow
try {
    vercel whoami 2>&1 | Out-Null
    Write-Host "✅ 已登录 Vercel" -ForegroundColor Green
    $isLoggedIn = $true
} catch {
    Write-Host "⚠️  未登录 Vercel" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "请选择部署方式：" -ForegroundColor Cyan
    Write-Host "1. 使用 Vercel（需要配置数据库）" -ForegroundColor White
    Write-Host "2. 使用 Railway（自动配置，推荐）" -ForegroundColor White
    Write-Host ""
    $choice = Read-Host "请输入选择 (1/2)"
    
    if ($choice -eq "1") {
        Write-Host ""
        Write-Host "正在打开 Vercel 登录页面..." -ForegroundColor Yellow
        Write-Host "请在浏览器中完成登录" -ForegroundColor Yellow
        vercel login
    } else {
        Write-Host ""
        Write-Host "🌐 正在打开 Railway 部署页面..." -ForegroundColor Green
        Write-Host "Railway 会自动配置数据库，更简单！" -ForegroundColor Green
        Start-Process "https://railway.app/new"
        Write-Host ""
        Write-Host "部署步骤：" -ForegroundColor Cyan
        Write-Host "1. 用 GitHub 登录 Railway" -ForegroundColor White
        Write-Host "2. 点击 'New Project' > 'Deploy from GitHub repo'" -ForegroundColor White
        Write-Host "3. 选择你的仓库: mathmaster" -ForegroundColor White
        Write-Host "4. 添加 MySQL 数据库（点击 + New > Database > MySQL）" -ForegroundColor White
        Write-Host "5. 在项目 Variables 中添加: DB_TYPE=mysql, JWT_SECRET=mathmaster_jwt_secret_key_2025" -ForegroundColor White
        Write-Host "6. Railway 会自动部署！" -ForegroundColor White
        exit
    }
}

Write-Host ""

# 检查项目是否已存在
Write-Host "🔍 检查 Vercel 项目..." -ForegroundColor Yellow
try {
    $project = vercel ls 2>&1 | Select-String "mathmaster"
    if ($project) {
        Write-Host "✅ 找到现有项目" -ForegroundColor Green
    } else {
        Write-Host "📦 创建新项目..." -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  无法检查项目，继续部署..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "⚠️  重要提示：" -ForegroundColor Red
Write-Host "部署到 Vercel 需要配置数据库环境变量！" -ForegroundColor Yellow
Write-Host ""
Write-Host "请先：" -ForegroundColor Cyan
Write-Host "1. 创建 Supabase 数据库（免费）：https://supabase.com" -ForegroundColor White
Write-Host "2. 在 Supabase SQL Editor 中运行 init-postgres.sql" -ForegroundColor White
Write-Host "3. 获取数据库连接信息" -ForegroundColor White
Write-Host ""
Write-Host "或者使用 Railway（更简单，自动配置数据库）：" -ForegroundColor Green
Write-Host "https://railway.app/new" -ForegroundColor Green
Write-Host ""

$continue = Read-Host "已配置数据库？继续部署？(y/n)"
if ($continue -ne "y") {
    Write-Host "部署已取消" -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "📦 开始部署..." -ForegroundColor Green
Write-Host ""

# 部署
vercel --prod

Write-Host ""
Write-Host "✅ 部署完成！" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  别忘了在 Vercel Dashboard 中配置环境变量：" -ForegroundColor Yellow
Write-Host "   Settings > Environment Variables" -ForegroundColor White

