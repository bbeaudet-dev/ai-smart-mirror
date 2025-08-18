#!/bin/bash

# AI Smart Mirror - Raspberry Pi Setup Script
# This script sets up the basic MagicMirror² installation on Raspberry Pi

echo "🤖 Setting up AI Smart Mirror on Raspberry Pi..."

# Check if running on Raspberry Pi
if ! grep -q "Raspberry Pi" /proc/cpuinfo; then
    echo "⚠️  Warning: This script is designed for Raspberry Pi"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js (if not already installed)
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo "✅ Node.js already installed: $(node --version)"
fi

# Install npm dependencies
echo "📦 Installing npm dependencies..."
npm install --only=prod

# Create basic config if it doesn't exist
if [ ! -f "config/config.js" ]; then
    echo "⚙️  Creating basic configuration..."
    cp config/config.js.sample config/config.js
    echo "✅ Basic configuration created at config/config.js"
    echo "📝 Please edit config/config.js to customize your setup"
fi

# Set up environment variables
if [ ! -f ".env" ]; then
    echo "🔧 Creating environment file..."
    cp env.example .env
    echo "✅ Environment file created at .env"
    echo "📝 Please edit .env to add your API keys when ready"
fi

# Make scripts executable
chmod +x setup-pi.sh

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit config/config.js to customize your mirror"
echo "2. Edit .env to add your API keys (optional for basic setup)"
echo "3. Run 'npm start' to start MagicMirror²"
echo "4. Access your mirror at http://your-pi-ip:8080"
echo ""
echo "To start the mirror:"
echo "  npm start"
echo ""
echo "To run in development mode:"
echo "  npm run start:dev"
echo ""
echo "To run the backend server (for AI features):"
echo "  npm run server"
