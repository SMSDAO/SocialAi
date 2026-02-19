#!/usr/bin/env node
/**
 * SocialAi Setup Automation Script
 * Zero-error, one-click setup for development and production
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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
  const regex = new RegExp(`^${varName}=.+$`, 'm');
  return !regex.test(envContent) || 
         envContent.includes(`${varName}=PLACEHOLDER_`) ||
         envContent.includes(`${varName}=YOUR_`);
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
  console.error('❌ Failed to install dependencies');
  process.exit(1);
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
