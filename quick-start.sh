#!/bin/bash

# HBIU LMS Quick Start Script
echo "🚀 HBIU LMS Backend Quick Start"
echo "==============================="

# Set PATH to include Node.js
export PATH="/usr/local/bin:$PATH"

# Navigate to backend directory
cd "$(dirname "$0")"

echo "📁 Current directory: $(pwd)"
echo "🔍 Checking Node.js..."

# Check Node.js
if command -v node >/dev/null 2>&1; then
    echo "✅ Node.js found: $(node --version)"
else
    echo "❌ Node.js not found. Please install from https://nodejs.org/"
    exit 1
fi

# Check npm
if command -v npm >/dev/null 2>&1; then
    echo "✅ npm found: $(npm --version)"
else
    echo "❌ npm not found"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo ""
echo "🚀 Starting HBIU LMS Backend..."
echo "📍 Server will run on: http://localhost:3001"
echo "🏥 Health check: http://localhost:3001/health"
echo "🛑 Press Ctrl+C to stop the server"
echo ""

# Start the server
npm run dev