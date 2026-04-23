# 医疗面试系统演示站点启动器

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  医疗面试系统演示站点启动器" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查Node.js环境
Write-Host "[1/3] 检查Node.js环境..." -NoNewline
$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
    Write-Host ""
    Write-Host "❌ Node.js未安装，请先安装Node.js" -ForegroundColor Red
    Read-Host "按Enter键退出"
    exit 1
}
Write-Host " ✅ 已安装 $nodeVersion" -ForegroundColor Green

# 检查依赖
Write-Host ""
Write-Host "[2/3] 检查依赖..." -NoNewline
if (-not (Test-Path "node_modules")) {
    Write-Host ""
    Write-Host "📦 正在安装依赖，请稍候..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "❌ 依赖安装失败" -ForegroundColor Red
        Read-Host "按Enter键退出"
        exit 1
    }
    Write-Host "✅ 依赖安装完成" -ForegroundColor Green
} else {
    Write-Host " ✅ 已安装" -ForegroundColor Green
}

# 启动开发服务器
Write-Host ""
Write-Host "[3/3] 启动开发服务器..." -ForegroundColor Cyan
Write-Host "🌐 访问地址: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "按Ctrl+C停止服务器" -ForegroundColor Gray
Write-Host ""

npm run dev
