#!/bin/bash

# Retinal-AI MongoDB Backend Startup Script

echo "🚀 Starting Retinal-AI MongoDB Backend Server..."
echo "================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Navigate to backend directory
cd backend

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Make sure you're in the correct directory."
    exit 1
fi

# Check if .env file exists, if not copy from .env.example
if [ ! -f ".env" ]; then
    echo "📋 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. Please edit it with your MongoDB credentials."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if dependencies were installed successfully
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies."
    exit 1
fi

# Create uploads directory if it doesn't exist
if [ ! -d "uploads" ]; then
    echo "📁 Creating uploads directory..."
    mkdir uploads
fi

# Create logs directory if it doesn't exist
if [ ! -d "logs" ]; then
    echo "📁 Creating logs directory..."
    mkdir logs
fi

echo "✅ Setup complete!"
echo ""
echo "🔧 Configuration:"
echo "   - MongoDB Backend Server"
echo "   - Port: 3001 (default)"
echo "   - Database: MongoDB Atlas"
echo "   - File Storage: Local + GridFS"
echo ""
echo "📝 Next steps:"
echo "   1. Edit backend/.env with your MongoDB connection string"
echo "   2. Ensure MongoDB Atlas cluster is accessible"
echo "   3. Start the server with: npm run dev"
echo ""

# Start the server in development mode
echo "🚀 Starting MongoDB backend server..."
npm run dev