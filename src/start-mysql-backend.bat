@echo off
REM Retinal-AI MySQL Backend Quick Start Script for Windows

echo ===========================================
echo 🚀 Retinal-AI MySQL Backend Quick Start
echo ===========================================

REM Check if MySQL is installed
echo [INFO] Checking MySQL installation...
mysql --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] MySQL is not installed. Please install MySQL first.
    echo Visit: https://dev.mysql.com/downloads/mysql/
    pause
    exit /b 1
) else (
    echo [SUCCESS] MySQL is installed
)

REM Check if Node.js is installed
echo [INFO] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed. Please install Node.js first.
    echo Visit: https://nodejs.org/
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do set node_version=%%i
    echo [SUCCESS] Node.js is installed (!node_version!)
)

REM Check if we're in the right directory
if not exist "App.tsx" (
    echo [ERROR] Please run this script from the Retinal-AI project root directory
    pause
    exit /b 1
)

REM Check if backend directory exists
if not exist "backend" (
    echo [ERROR] Backend directory not found. Please ensure the backend files are in place.
    pause
    exit /b 1
)

REM Navigate to backend directory
cd backend

REM Install backend dependencies
echo [INFO] Installing backend dependencies...
npm install
if errorlevel 1 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
) else (
    echo [SUCCESS] Backend dependencies installed
)

REM Check if .env file exists
if not exist ".env" (
    echo [WARNING] .env file not found. Creating from .env.example...
    if exist ".env.example" (
        copy ".env.example" ".env" >nul
        echo [WARNING] Please edit the .env file with your database credentials before continuing
        echo Press any key when you've configured the .env file...
        pause >nul
    ) else (
        echo [ERROR] .env.example file not found
        pause
        exit /b 1
    )
)

REM Run database migration
echo [INFO] Running database migration...
node scripts/migrate.js
if errorlevel 1 (
    echo [ERROR] Database migration failed
    pause
    exit /b 1
) else (
    echo [SUCCESS] Database migration completed
)

REM Start the backend server
echo [INFO] Starting backend server...
echo [SUCCESS] Backend server starting on port 3001...
echo [SUCCESS] You can now start the frontend with: npm start
echo.
echo 🎉 Setup Complete! Demo accounts:
echo 📧 Admin: admin@retinal-ai.com (password: admin123)
echo 👨‍⚕️ Doctor: dr.smith@hospital.com (password: doctor123)
echo 🧑‍🦱 Patient: patient@email.com (password: patient123)
echo.

REM Start the server
npm start