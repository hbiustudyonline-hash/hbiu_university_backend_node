#!/bin/bash

# HBIU LMS Backend Startup Script
# This script will help you start the server once Node.js is properly installed

echo "🚀 HBIU LMS Backend Startup"
echo "=========================="

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check Node.js installation
if ! command_exists node; then
    echo "❌ Node.js is not found in PATH"
    echo ""
    echo "🔧 Possible solutions:"
    echo "1. Restart your terminal completely (close and reopen)"
    echo "2. Check if Node.js is installed: /usr/local/bin/node --version"
    echo "3. Add Node.js to PATH manually:"
    echo "   export PATH=\"/usr/local/bin:\$PATH\""
    echo "4. Reinstall Node.js from https://nodejs.org/"
    echo ""
    echo "💡 After fixing Node.js access, run this script again"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

if ! command_exists npm; then
    echo "❌ npm is not found in PATH"
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Navigate to backend directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "📁 Working directory: $(pwd)"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
else
    echo "✅ Dependencies already installed"
fi

# Create necessary directories
mkdir -p database logs uploads 2>/dev/null
echo "✅ Directories ready"

# Check port availability (simple check)
echo "🔍 Starting server on port 3001..."
echo "📝 If port 3001 is busy, the server will show an error"
echo "💡 You can change the port in .env file (PORT=3002, etc.)"
echo ""

# Start the server
echo "🚀 Starting development server..."
npm run dev