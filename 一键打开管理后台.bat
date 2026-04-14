@echo off
chcp 65001 >nul
setlocal
title 合域管理后台
cd /d "%~dp0"

if not exist "node_modules\" (
  echo [合域管理后台] 首次运行，正在安装依赖...
  call npm install
  if errorlevel 1 (
    echo 依赖安装失败，请检查 Node.js 与网络。
    pause
    exit /b 1
  )
)

echo [合域管理后台] 正在启动开发服务器（新窗口）...
start "合域管理后台 · Vite" cmd /k "npm run dev"

timeout /t 4 /nobreak >nul
start "" "http://localhost:5174/"

echo 已在浏览器打开 http://localhost:5174  （与主站 5173 区分；若失败请手动访问）
echo 关闭标题为「合域管理后台 · Vite」的窗口即可停止服务。
endlocal
