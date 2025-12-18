#!/bin/bash

echo "🔍 HBIU LMS Backend - Pre-flight Check"
echo "======================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Not in backend directory. Please run from backend folder."
    exit 1
fi

echo "✅ In correct directory: $(pwd)"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found"
    echo "📋 Please install Node.js from https://nodejs.org/"
    echo "💡 After installation, run this script again"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found"
    exit 1
fi

echo "✅ npm found: $(npm --version)"

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

# Check important files
echo "📁 Checking important files..."
files=("server.js" ".env" "config/database.js" "models/index.js")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file missing"
    fi
done

# Create directories
mkdir -p database logs uploads
echo "✅ Created necessary directories"

echo ""
echo "🚀 Ready to start! Run:"
echo "   npm run dev        (normal start)"
echo "   npm run dev:fresh  (fresh database)"
echo "   npm run seed       (add sample data)"
echo ""
echo "🌐 Server will be available at: http://localhost:5000"
echo "🏥 Health check: http://localhost:5000/health"