@echo off
chcp 65001 >nul
echo 正在启动 MathMaster 服务器...
echo.
cd /d "%~dp0"
node server.js
pause

