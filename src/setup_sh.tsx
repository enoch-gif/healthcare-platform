#!/bin/bash

# Retinal-AI Platform Setup Script
# This script automates the local setup process

echo "🏥 Retinal-AI Medical Platform Setup"
echo "===================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18.0 or higher from https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18.0 or higher is required. Current version: $(node --version)"
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Create project directory
PROJECT_NAME="retinal-ai-platform"
echo "📁 Creating project directory: $PROJECT_NAME"

if [ -d "$PROJECT_NAME" ]; then
    echo "⚠️  Directory $PROJECT_NAME already exists."
    read -p "Do you want to remove it and start fresh? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf "$PROJECT_NAME"
        echo "🗑️  Removed existing directory"
    else
        echo "❌ Setup cancelled"
        exit 1
    fi
fi

# Create React app
echo "⚛️  Creating React TypeScript application..."
npx create-react-app "$PROJECT_NAME" --template typescript

# Navigate to project directory
cd "$PROJECT_NAME"

# Install additional dependencies
echo "📦 Installing additional dependencies..."

# Core dependencies
npm install react-router-dom lucide-react sonner@2.0.3 motion recharts react-hook-form@7.55.0 clsx class-variance-authority

# Development dependencies
npm install -D @tailwindcss/forms

echo "✅ Dependencies installed successfully"

# Create directory structure
echo "📂 Creating project structure..."

# Create additional directories
mkdir -p src/components/ui src/components/figma src/services src/styles

# Create placeholder files
touch src/components/ui/utils.ts
echo "// Utility functions for UI components" > src/components/ui/utils.ts

# Update package.json with project information
echo "📝 Updating package.json..."
npm pkg set name="retinal-ai-platform"
npm pkg set description="AI-powered retinal disease diagnosis platform"
npm pkg set version="1.0.0"

# Create Tailwind config
echo "🎨 Setting up Tailwind CSS..."
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'medical-blue': '#0A3D62',
        'medical-blue-light': '#1E5F8B',
        'medical-blue-lighter': '#E3F2FD',
        'health-green': '#27AE60',
        'health-green-light': '#52C882',
        'health-green-lighter': '#E8F5E8',
        'accent-red': '#E74C3C',
        'accent-red-light': '#EC7063',
        'accent-red-lighter': '#FADBD8'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms')
  ]
}
EOF

# Update index.html
echo "📄 Updating index.html..."
cat > public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#0A3D62" />
    <meta name="description" content="AI-powered retinal disease diagnosis platform" />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <title>Retinal-AI Medical Platform</title>
    
    <!-- Inter Font -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
EOF

# Create a basic index.tsx that imports globals.css
echo "⚛️  Creating index.tsx..."
cat > src/index.tsx << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/globals.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF

echo ""
echo "🎉 Project setup completed successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Copy all source files from Figma Make to the src/ directory"
echo "2. Copy the globals.css to src/styles/globals.css"
echo "3. Copy all component files to src/components/"
echo "4. Copy dataStore.js to src/services/"
echo ""
echo "🚀 To start the development server:"
echo "   cd $PROJECT_NAME"
echo "   npm start"
echo ""
echo "🌐 The application will be available at: http://localhost:3000"
echo ""
echo "🔐 Default login credentials:"
echo "   Doctor: sarah.johnson@retinalai.com / doctor123"
echo "   Admin: admin@retinalai.com / admin123"
echo "   Patient: john.smith@email.com / patient123"
echo ""
echo "🏥 Happy coding with Retinal-AI!"