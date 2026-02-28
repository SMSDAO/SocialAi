#!/usr/bin/env node
/**
 * SocialAi Setup Automation Script
 * Zero-error, one-click setup for development and production
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');

console.log('🚀 SocialAi Setup Automation\n');

// Check Node version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
if (majorVersion < 24) {
  console.error(`❌ Node.js 24+ is required. Current version: ${nodeVersion}`);
  console.error('Please install Node.js 24+ from https://nodejs.org/');
  process.exit(1);
}
console.log(`✅ Node.js version: ${nodeVersion}`);

// Setup .env if it doesn't exist
const envExample = path.join(rootDir, '.env.example');
const envFile = path.join(rootDir, '.env');

if (!fs.existsSync(envFile)) {
  console.log('📝 Creating .env file from .env.example...');
  fs.copyFileSync(envExample, envFile);
  console.log('✅ .env file created');
  console.log('⚠️  Please edit .env with your configuration values\n');
} else {
  console.log('✅ .env file already exists\n');
}

// Check for required environment variables
console.log('🔍 Checking environment configuration...');
const envContent = fs.readFileSync(envFile, 'utf8');
const requiredVars = ['DATABASE_URL', 'JWT_SECRET', 'SESSION_SECRET'];
const missingVars = requiredVars.filter(varName => {
  const regex = new RegExp(`^${varName}=(.+)$`, 'm');
  const match = regex.exec(envContent);
  if (!match) return true;
  const value = match[1];
  // Check if value contains PLACEHOLDER_ anywhere (not just at start)
  return value.includes('PLACEHOLDER_') || value.includes('YOUR_');
});

if (missingVars.length > 0) {
  console.warn('⚠️  The following environment variables need configuration:');
  missingVars.forEach(v => console.warn(`   - ${v}`));
  console.warn('   Please update your .env file\n');
} else {
  console.log('✅ Environment variables configured\n');
}

// Install dependencies
console.log('📦 Installing dependencies...');
try {
  execSync('npm install', { cwd: rootDir, stdio: 'inherit' });
  console.log('✅ Dependencies installed\n');
} catch (error) {
  console.warn('⚠️  Standard install failed, retrying with --legacy-peer-deps...');
  try {
    execSync('npm install --legacy-peer-deps', { cwd: rootDir, stdio: 'inherit' });
    console.log('✅ Dependencies installed with --legacy-peer-deps\n');
  } catch (retryError) {
    console.error('❌ Failed to install dependencies');
    console.error('   Try running: npm install --legacy-peer-deps');
    process.exit(1);
  }
}

// Summary
console.log('✅ Setup Complete!\n');
console.log('Next steps:');
console.log('1. Configure your .env file with actual values');
console.log('2. Setup your database: npm run db:init');
console.log('3. Start development:');
console.log('   - Backend: npm run dev');
console.log('   - Public App: npm run dev:public');
console.log('   - Admin Console: npm run dev:admin');
console.log('   - Desktop Admin: npm run dev:desktop');
console.log('\nFor production deployment, see docs/DEPLOYMENT.md\n');
