@echo off
:: Retinal-AI MongoDB Backend Startup Script for Windows

echo 🚀 Starting Retinal-AI MongoDB Backend Server...
echo ================================================

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

:: Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

:: Navigate to backend directory
cd backend

:: Check if package.json exists
if not exist "package.json" (
    echo ❌ package.json not found. Make sure you're in the correct directory.
    pause
    exit /b 1
)

:: Check if .env file exists, if not copy from .env.example
if not exist ".env" (
    echo 📋 Creating .env file from .env.example...
    copy .env.example .env
    echo ✅ .env file created. Please edit it with your MongoDB credentials.
)

:: Install dependencies
echo 📦 Installing dependencies...
npm install

:: Check if dependencies were installed successfully
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies.
    pause
    exit /b 1
)

:: Create uploads directory if it doesn't exist
if not exist "uploads" (
    echo 📁 Creating uploads directory...
    mkdir uploads
)

:: Create logs directory if it doesn't exist
if not exist "logs" (
    echo 📁 Creating logs directory...
    mkdir logs
)

echo ✅ Setup complete!
echo.
echo 🔧 Configuration:
echo    - MongoDB Backend Server
echo    - Port: 3001 (default^)
echo    - Database: MongoDB Atlas
echo    - File Storage: Local + GridFS
echo.
echo 📝 Next steps:
echo    1. Edit backend\.env with your MongoDB connection string
echo    2. Ensure MongoDB Atlas cluster is accessible
echo    3. Start the server with: npm run dev
echo.

:: Start the server in development mode
echo 🚀 Starting MongoDB backend server...
npm run dev

pause