#!/bin/bash

# HBIU LMS Backend Startup Script
echo "🚀 Starting HBIU LMS Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "📋 Please install Node.js from https://nodejs.org/"
    echo "💡 After installation, run this script again."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed!"
    echo "📋 Please install Node.js (which includes npm) from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Navigate to backend directory
cd "$(dirname "$0")"
echo "📁 Current directory: $(pwd)"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found!"
    echo "📋 Make sure you're running this from the backend directory."
    exit 1
fi

# Create necessary directories
mkdir -p database logs uploads
echo "📁 Created necessary directories"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies!"
        exit 1
    fi
    echo "✅ Dependencies installed successfully"
else
    echo "✅ Dependencies already installed"
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚙️ Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created"
else
    echo "✅ .env file exists"
fi

# Start the server
echo "🚀 Starting development server..."
npm run dev