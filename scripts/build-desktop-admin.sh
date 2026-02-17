#!/bin/bash
# Build script for Windows admin desktop app

echo "🚀 Building SocialAi Desktop Admin for Windows..."
echo ""

# Check for Rust
if ! command -v rustc &> /dev/null; then
    echo "❌ Rust is not installed."
    echo "Please install Rust from: https://rustup.rs/"
    exit 1
fi

# Check for Node.js 24+
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 24 ]; then
    echo "❌ Node.js 24+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Navigate to desktop-admin directory
cd "$(dirname "$0")/../desktop-admin" || exit 1

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build for Windows
echo "🔨 Building for Windows..."
npm run build:windows

echo ""
echo "✅ Build complete!"
echo "📂 Installers are located in: desktop-admin/src-tauri/target/release/bundle/"
echo ""
echo "Available installers:"
echo "  - MSI: admin.msi"
echo "  - NSIS: admin-setup.exe"
