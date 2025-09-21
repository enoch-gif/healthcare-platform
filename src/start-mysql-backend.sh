#!/bin/bash

# Retinal-AI MySQL Backend Quick Start Script
echo "🚀 Retinal-AI MySQL Backend Quick Start"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if MySQL is installed
print_status "Checking MySQL installation..."
if command -v mysql &> /dev/null; then
    print_success "MySQL is installed"
else
    print_error "MySQL is not installed. Please install MySQL first."
    echo "Visit: https://dev.mysql.com/downloads/mysql/"
    exit 1
fi

# Check if Node.js is installed
print_status "Checking Node.js installation..."
if command -v node &> /dev/null; then
    node_version=$(node --version)
    print_success "Node.js is installed (${node_version})"
else
    print_error "Node.js is not installed. Please install Node.js first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "App.tsx" ]; then
    print_error "Please run this script from the Retinal-AI project root directory"
    exit 1
fi

# Create backend directory if it doesn't exist
if [ ! -d "backend" ]; then
    print_error "Backend directory not found. Please ensure the backend files are in place."
    exit 1
fi

# Navigate to backend directory
cd backend

# Install backend dependencies
print_status "Installing backend dependencies..."
if npm install; then
    print_success "Backend dependencies installed"
else
    print_error "Failed to install backend dependencies"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Creating from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_warning "Please edit the .env file with your database credentials before continuing"
        echo "Press Enter when you've configured the .env file..."
        read
    else
        print_error ".env.example file not found"
        exit 1
    fi
fi

# Check MySQL connection
print_status "Testing MySQL connection..."
DB_HOST=$(grep DB_HOST .env | cut -d '=' -f2)
DB_PORT=$(grep DB_PORT .env | cut -d '=' -f2)
DB_USER=$(grep DB_USER .env | cut -d '=' -f2)
DB_PASSWORD=$(grep DB_PASSWORD .env | cut -d '=' -f2)

# Simple MySQL connection test
if mysql -h${DB_HOST:-localhost} -P${DB_PORT:-3306} -u${DB_USER:-root} -p${DB_PASSWORD} -e "SELECT 1;" &> /dev/null; then
    print_success "MySQL connection successful"
else
    print_error "Cannot connect to MySQL. Please check your database credentials in .env"
    exit 1
fi

# Run database migration
print_status "Running database migration..."
if node scripts/migrate.js; then
    print_success "Database migration completed"
else
    print_error "Database migration failed"
    exit 1
fi

# Start the backend server
print_status "Starting backend server..."
print_success "Backend server starting on port 3001..."
print_success "You can now start the frontend with: npm start"

echo ""
echo "🎉 Setup Complete! Demo accounts:"
echo "📧 Admin: admin@retinal-ai.com (password: admin123)"
echo "👨‍⚕️ Doctor: dr.smith@hospital.com (password: doctor123)"
echo "🧑‍🦱 Patient: patient@email.com (password: patient123)"
echo ""

# Start the server
npm start