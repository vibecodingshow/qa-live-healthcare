@echo off
echo ========================================
echo   医疗面试系统演示站点启动器
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] 检查Node.js环境...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js未安装，请先安装Node.js
    pause
    exit /b 1
)
echo ✅ Node.js已安装

echo.
echo [2/3] 检查依赖...
if not exist "node_modules" (
    echo 📦 正在安装依赖，请稍候...
    call npm install
    if errorlevel 1 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
    echo ✅ 依赖安装完成
) else (
    echo ✅ 依赖已安装
)

echo.
echo [3/3] 启动开发服务器...
echo 🌐 访问地址: http://localhost:5173
echo.
echo 按Ctrl+C停止服务器
echo.

npm run dev

pause
