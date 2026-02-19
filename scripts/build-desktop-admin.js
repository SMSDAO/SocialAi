#!/usr/bin/env node
/**
 * Cross-platform build script for Windows admin desktop app
 * Works on Windows, macOS, and Linux
 */

const { execSync } = require('child_process');
const { existsSync } = require('fs');
const { resolve } = require('path');

console.log('🚀 Building SocialAi Desktop Admin for Windows...\n');

// Check for Rust
try {
  execSync('rustc --version', { stdio: 'pipe' });
} catch (error) {
  console.error('❌ Rust is not installed.');
  console.error('Please install Rust from: https://rustup.rs/');
  process.exit(1);
}

// Check for Node.js 24+
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
if (majorVersion < 24) {
  console.error(`❌ Node.js 24+ is required. Current version: ${nodeVersion}`);
  console.error('Please install Node.js 24+ from https://nodejs.org/');
  process.exit(1);
}

console.log('✅ Prerequisites check passed\n');

// Navigate to desktop-admin directory
const desktopAdminDir = resolve(__dirname, '../desktop-admin');
if (!existsSync(desktopAdminDir)) {
  console.error('❌ desktop-admin directory not found');
  process.exit(1);
}

process.chdir(desktopAdminDir);

// Install dependencies
console.log('📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Failed to install dependencies');
  process.exit(1);
}

// Build for Windows
console.log('🔨 Building for Windows...');
try {
  execSync('npm run build:windows', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Build failed');
  process.exit(1);
}

console.log('\n✅ Build complete!');
console.log('📂 Installers are located in: desktop-admin/src-tauri/target/release/bundle/\n');
console.log('Available installers:');
console.log('  - MSI: admin.msi');
console.log('  - NSIS: admin-setup.exe\n');
