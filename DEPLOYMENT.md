# 🚀 SocialAi v0.1 Deployment Guide

This guide provides comprehensive instructions for deploying the SocialAi v0.1 project across two primary deployment targets:

- **Vercel**: Public-facing application (apps/public)
- **OVH VPS**: Backend API, Workers, and Admin Console

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Architecture Overview](#architecture-overview)
3. [Vercel Deployment (Public App)](#vercel-deployment-public-app)
4. [OVH VPS Deployment (Backend + Workers + Admin)](#ovh-vps-deployment-backend--workers--admin)
5. [Deployment Diagram](#deployment-diagram)
6. [Final Checklist](#final-checklist)

---

## Prerequisites

Before deploying, ensure you have:

- **Vercel Account**: For public app hosting
- **OVH VPS**: Ubuntu 22.04 LTS with root access
- **Domain Name**: With DNS control
- **GitHub Repository Access**: For automated deployments
- **API Keys**:
  - SmartBrain API key (for AI features)
  - Ethereum, BASE, and Solana RPC endpoints
  - Farcaster Hub URL

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Traffic                             │
└──────────────┬──────────────────────────────────┬───────────────┘
               │                                  │
       ┌───────▼────────┐                ┌───────▼────────┐
       │                │                │                │
       │  Vercel CDN    │                │  Cloudflare    │
       │  (Public App)  │                │  (Optional)    │
       │                │                │                │
       └───────┬────────┘                └───────┬────────┘
               │                                  │
       ┌───────▼──────────────────────────────────▼────────┐
       │            OVH VPS (your-domain.com)              │
       │  ┌─────────────────────────────────────────────┐  │
       │  │              Nginx (Port 80/443)            │  │
       │  │  • SSL Termination                          │  │
       │  │  • Reverse Proxy                            │  │
       │  │  • Security Headers                         │  │
       │  └──────┬──────────────────┬───────────────────┘  │
       │         │                  │                      │
       │  ┌──────▼─────┐    ┌──────▼─────┐               │
       │  │   Backend  │    │   Admin    │               │
       │  │  (Port 3000)│    │ (Port 4200)│               │
       │  │            │    │            │               │
       │  │ API Routes │    │  Angular   │               │
       │  │ Express.js │    │   Console  │               │
       │  └──────┬─────┘    └────────────┘               │
       │         │                                        │
       │  ┌──────▼──────────────────────────────┐        │
       │  │     Worker Orchestrator             │        │
       │  │  (socialai.node.js - Healdec)       │        │
       │  │                                     │        │
       │  │  ┌────────────────────────────┐    │        │
       │  │  │   Parallel Workers         │    │        │
       │  │  │  • Farcaster Worker        │    │        │
       │  │  │  • Reddit Worker           │    │        │
       │  │  │  • Ethereum RPC Worker     │    │        │
       │  │  │  • BASE RPC Worker         │    │        │
       │  │  │  • Solana RPC Worker       │    │        │
       │  │  │  • Search Worker           │    │        │
       │  │  │  • AI Worker               │    │        │
       │  │  └────────────┬───────────────┘    │        │
       │  └───────────────┼────────────────────┘        │
       │                  │                             │
       │  ┌───────────────▼────────────────┐            │
       │  │   PostgreSQL 15+ (Port 5432)   │            │
       │  │   • pgvector extension         │            │
       │  │   • Optimized indexes          │            │
       │  └────────────────────────────────┘            │
       └───────────────────────────────────────────────┘
                          │
                ┌─────────▼──────────┐
                │  External Services │
                │  • SmartBrain API  │
                │  • Farcaster Hub   │
                │  • RPC Nodes       │
                └────────────────────┘
```

---

## Vercel Deployment (Public App)

The public-facing application is deployed on Vercel for optimal global CDN distribution and automatic scaling.

### 1. Project Setup

#### 1.1 Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

#### 1.2 Link Repository

Connect your GitHub repository to Vercel:
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your `SMSDAO/SocialAi` repository
4. Select the `apps/public` directory as the root

### 2. Vercel Configuration

#### 2.1 Create vercel.json

Create `apps/public/vercel.json`:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "astro",
  "regions": ["iad1"],
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-vps-domain.com/api/:path*"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    },
    {
      "source": "/(.*)\\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

#### 2.2 Update Astro Configuration

Ensure `apps/public/astro.config.mjs` is configured for Vercel:

```javascript
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  output: 'server',
  adapter: vercel({
    edgeMiddleware: true,
    functionPerRoute: false
  }),
  server: {
    port: 4321,
    host: true
  }
});
```

### 3. Environment Variables

Configure the following environment variables in Vercel Dashboard (Settings → Environment Variables):

```bash
# Backend API URL (your OVH VPS)
PUBLIC_API_URL=https://your-vps-domain.com/api

# Assets URL
PUBLIC_ASSETS_URL=https://your-vps-domain.com/assets

# SmartBrain API
PUBLIC_SMARTBRAIN_URL=https://api.smartbrain.io
```

**Important**: All public environment variables must be prefixed with `PUBLIC_` for Astro.

### 4. Build Settings

Configure build settings in Vercel:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Astro |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |
| **Node Version** | 22.x |
| **Root Directory** | `apps/public` |

### 5. Runtime Selection

#### Edge Runtime (Recommended for SSR routes)
- Best for: `/profiles/*`, `/timeline/*`
- Lowest latency globally
- Limited to 4MB bundle size

#### Node.js Runtime
- Best for: Complex API routes
- Full Node.js API access
- Larger bundle support

Configure in `astro.config.mjs` per route as needed.

### 6. API Proxying Configuration

The public app proxies API requests to the OVH VPS:

```
/api/* → https://your-vps-domain.com/api/*
/profiles/* → SSR on Vercel → Backend API
/timeline/* → SSR on Vercel → Backend API
```

This is handled by the `vercel.json` rewrites configuration above.

### 7. Domain Configuration

1. **Add Domain**: Vercel Dashboard → Project → Settings → Domains
2. **Configure DNS**:
   ```
   CNAME  www    cname.vercel-dns.com
   A      @      76.76.21.21
   ```
3. **SSL**: Automatically provisioned by Vercel

### 8. Caching Strategy

```javascript
// In your Astro pages, set cache headers:
export const prerender = false; // Disable for dynamic pages

// For API responses
Astro.response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
```

### 9. Rate Limiting

Implement rate limiting in your Astro middleware:

```javascript
// apps/public/src/middleware.js
export async function onRequest({ request, next }) {
  // Add rate limiting logic here
  const ip = request.headers.get('x-forwarded-for');
  // Check rate limits via backend API
  return next();
}
```

### 10. SEO Optimizations

Ensure SSR pages include:
- Proper `<title>` tags
- Meta descriptions
- Open Graph tags
- Canonical URLs
- Structured data (JSON-LD)

### 11. Deploy

#### Via Git Push (Recommended)
```bash
git push origin main
```
Vercel auto-deploys on push.

#### Via CLI
```bash
cd apps/public
vercel --prod
```

---

## OVH VPS Deployment (Backend + Workers + Admin)

The backend, workers, and admin console are deployed on an OVH VPS for full control and cost efficiency.

### 1. Server Requirements

- **OS**: Ubuntu 22.04 LTS
- **RAM**: 4GB minimum (8GB recommended)
- **Storage**: 50GB SSD minimum
- **CPU**: 2 cores minimum (4 cores recommended)
- **Network**: 1Gbps minimum

### 2. Initial Server Setup

#### 2.1 Connect to VPS

```bash
ssh root@your-vps-ip
```

#### 2.2 Update System

```bash
apt update && apt upgrade -y
```

#### 2.3 Create Deployment User

```bash
adduser socialai
usermod -aG sudo socialai
su - socialai
```

#### 2.4 Install Required Software

```bash
# Node.js 22.x
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# PostgreSQL 15+
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt update
sudo apt install -y postgresql-15 postgresql-contrib-15

# Nginx
sudo apt install -y nginx

# Certbot (Let's Encrypt)
sudo apt install -y certbot python3-certbot-nginx

# PM2 (Process Manager)
sudo npm install -g pm2

# Git
sudo apt install -y git
```

### 3. Database Setup

#### 3.1 Configure PostgreSQL

```bash
sudo -u postgres psql

-- Create database
CREATE DATABASE socialai;

-- Create user
CREATE USER socialai_user WITH PASSWORD 'your_secure_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE socialai TO socialai_user;

-- Enable pgvector extension
\c socialai
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Exit
\q
```

#### 3.2 Performance Tuning

Edit PostgreSQL config:

```bash
sudo nano /etc/postgresql/15/main/postgresql.conf
```

Update these settings based on your VPS resources:

```conf
# For 8GB RAM VPS
shared_buffers = 2GB
effective_cache_size = 6GB
maintenance_work_mem = 512MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 10485kB
min_wal_size = 1GB
max_wal_size = 4GB
max_worker_processes = 4
max_parallel_workers_per_gather = 2
max_parallel_workers = 4
max_parallel_maintenance_workers = 2
```

Restart PostgreSQL:

```bash
sudo systemctl restart postgresql
```

#### 3.3 Apply Database Schema

```bash
psql -U socialai_user -d socialai -f /home/socialai/SocialAi/db/schema.sql
```

### 4. Backend Deployment

#### 4.1 Clone Repository

```bash
cd /home/socialai
git clone https://github.com/SMSDAO/SocialAi.git
cd SocialAi
```

#### 4.2 Install Dependencies

```bash
npm install
```

#### 4.3 Configure Environment Variables

```bash
cp .env.example .env
nano .env
```

Update with your production values:

```bash
# Database Configuration
DATABASE_URL=postgresql://socialai_user:your_secure_password_here@localhost:5432/socialai

# API Configuration
PORT=3000
API_URL=https://your-vps-domain.com/api
NODE_ENV=production

# Worker Configuration
FARCASTER_HUB_URL=https://hub.farcaster.xyz
REDDIT_API_URL=https://www.reddit.com

# Blockchain RPC URLs
ETH_RPC_URL=https://eth.llamarpc.com
BASE_RPC_URL=https://mainnet.base.org
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# SmartBrain API Configuration
SMARTBRAIN_API_KEY=your_smartbrain_api_key_here

# Security
JWT_SECRET=your_generated_jwt_secret_here
RATE_LIMIT=100

# Feature Flags
ENABLE_FARCASTER_SYNC=true
ENABLE_REDDIT_SYNC=false
ENABLE_AI_FEATURES=true
```

**Generate JWT Secret:**

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### 4.4 Build Backend (if needed)

```bash
# No build step needed for Node backend
# Ensure node/socialai.node.js is executable
chmod +x node/socialai.node.js
```

### 5. Workers Deployment

#### 5.1 Systemd Service Files

Create systemd service files for backend and workers:

##### Backend Service

```bash
sudo nano /etc/systemd/system/socialai-backend.service
```

```ini
[Unit]
Description=SocialAi Backend API
After=network.target postgresql.service
Wants=postgresql.service

[Service]
Type=simple
User=socialai
WorkingDirectory=/home/socialai/SocialAi/node
Environment=NODE_ENV=production
EnvironmentFile=/home/socialai/SocialAi/.env
ExecStart=/usr/bin/node socialai.node.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=socialai-backend

# Security hardening
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=yes
ReadWritePaths=/home/socialai/SocialAi
ProtectKernelTunables=true
ProtectControlGroups=true
RestrictRealtime=true
RestrictNamespaces=true
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
```

##### Farcaster Worker

```bash
sudo nano /etc/systemd/system/socialai-farcaster-worker.service
```

```ini
[Unit]
Description=SocialAi Farcaster Worker
After=network.target postgresql.service socialai-backend.service
Requires=socialai-backend.service

[Service]
Type=simple
User=socialai
WorkingDirectory=/home/socialai/SocialAi/workers
Environment=NODE_ENV=production
EnvironmentFile=/home/socialai/SocialAi/.env
ExecStart=/usr/bin/node farcaster.worker.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=socialai-farcaster-worker

# Security hardening
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=yes
ReadWritePaths=/home/socialai/SocialAi
ProtectKernelTunables=true
ProtectControlGroups=true
RestrictRealtime=true

[Install]
WantedBy=multi-user.target
```

##### Reddit Worker

```bash
sudo nano /etc/systemd/system/socialai-reddit-worker.service
```

```ini
[Unit]
Description=SocialAi Reddit Worker
After=network.target postgresql.service socialai-backend.service
Requires=socialai-backend.service

[Service]
Type=simple
User=socialai
WorkingDirectory=/home/socialai/SocialAi/workers
Environment=NODE_ENV=production
EnvironmentFile=/home/socialai/SocialAi/.env
ExecStart=/usr/bin/node reddit.worker.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=socialai-reddit-worker

# Security hardening
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=yes
ReadWritePaths=/home/socialai/SocialAi

[Install]
WantedBy=multi-user.target
```

##### AI Worker

```bash
sudo nano /etc/systemd/system/socialai-ai-worker.service
```

```ini
[Unit]
Description=SocialAi AI Worker
After=network.target postgresql.service socialai-backend.service
Requires=socialai-backend.service

[Service]
Type=simple
User=socialai
WorkingDirectory=/home/socialai/SocialAi/workers
Environment=NODE_ENV=production
EnvironmentFile=/home/socialai/SocialAi/.env
ExecStart=/usr/bin/node ai.worker.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=socialai-ai-worker

# Security hardening
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=yes
ReadWritePaths=/home/socialai/SocialAi

[Install]
WantedBy=multi-user.target
```

##### Ethereum Worker

```bash
sudo nano /etc/systemd/system/socialai-ethereum-worker.service
```

```ini
[Unit]
Description=SocialAi Ethereum RPC Worker
After=network.target postgresql.service socialai-backend.service
Requires=socialai-backend.service

[Service]
Type=simple
User=socialai
WorkingDirectory=/home/socialai/SocialAi/workers
Environment=NODE_ENV=production
EnvironmentFile=/home/socialai/SocialAi/.env
ExecStart=/usr/bin/node ethereum.worker.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=socialai-ethereum-worker

# Security hardening
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=yes
ReadWritePaths=/home/socialai/SocialAi

[Install]
WantedBy=multi-user.target
```

##### BASE Worker

```bash
sudo nano /etc/systemd/system/socialai-base-worker.service
```

```ini
[Unit]
Description=SocialAi BASE RPC Worker
After=network.target postgresql.service socialai-backend.service
Requires=socialai-backend.service

[Service]
Type=simple
User=socialai
WorkingDirectory=/home/socialai/SocialAi/workers
Environment=NODE_ENV=production
EnvironmentFile=/home/socialai/SocialAi/.env
ExecStart=/usr/bin/node base.worker.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=socialai-base-worker

# Security hardening
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=yes
ReadWritePaths=/home/socialai/SocialAi

[Install]
WantedBy=multi-user.target
```

##### Solana Worker

```bash
sudo nano /etc/systemd/system/socialai-solana-worker.service
```

```ini
[Unit]
Description=SocialAi Solana RPC Worker
After=network.target postgresql.service socialai-backend.service
Requires=socialai-backend.service

[Service]
Type=simple
User=socialai
WorkingDirectory=/home/socialai/SocialAi/workers
Environment=NODE_ENV=production
EnvironmentFile=/home/socialai/SocialAi/.env
ExecStart=/usr/bin/node solana.worker.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=socialai-solana-worker

# Security hardening
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=yes
ReadWritePaths=/home/socialai/SocialAi

[Install]
WantedBy=multi-user.target
```

##### Search Worker

```bash
sudo nano /etc/systemd/system/socialai-search-worker.service
```

```ini
[Unit]
Description=SocialAi Search Worker
After=network.target postgresql.service socialai-backend.service
Requires=socialai-backend.service

[Service]
Type=simple
User=socialai
WorkingDirectory=/home/socialai/SocialAi/workers
Environment=NODE_ENV=production
EnvironmentFile=/home/socialai/SocialAi/.env
ExecStart=/usr/bin/node search.worker.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=socialai-search-worker

# Security hardening
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=yes
ReadWritePaths=/home/socialai/SocialAi

[Install]
WantedBy=multi-user.target
```

#### 5.2 Enable and Start Services

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable services (start on boot)
sudo systemctl enable socialai-backend
sudo systemctl enable socialai-farcaster-worker
sudo systemctl enable socialai-reddit-worker
sudo systemctl enable socialai-ai-worker
sudo systemctl enable socialai-ethereum-worker
sudo systemctl enable socialai-base-worker
sudo systemctl enable socialai-solana-worker
sudo systemctl enable socialai-search-worker

# Start services
sudo systemctl start socialai-backend
sudo systemctl start socialai-farcaster-worker
sudo systemctl start socialai-reddit-worker
sudo systemctl start socialai-ai-worker
sudo systemctl start socialai-ethereum-worker
sudo systemctl start socialai-base-worker
sudo systemctl start socialai-solana-worker
sudo systemctl start socialai-search-worker
```

#### 5.3 Check Service Status

```bash
# Check individual service
sudo systemctl status socialai-backend

# Check all services
sudo systemctl status socialai-*

# View logs
sudo journalctl -u socialai-backend -f
sudo journalctl -u socialai-farcaster-worker -f
```

### 6. Admin App Deployment

#### 6.1 Build Admin App

```bash
cd /home/socialai/SocialAi/apps/admin
npm install
npm run build
```

This creates `dist/` directory with production build.

#### 6.2 Create Admin Service

```bash
sudo nano /etc/systemd/system/socialai-admin.service
```

```ini
[Unit]
Description=SocialAi Admin Console
After=network.target socialai-backend.service
Requires=socialai-backend.service

[Service]
Type=simple
User=socialai
WorkingDirectory=/home/socialai/SocialAi/apps/admin
Environment=NODE_ENV=production
ExecStart=/usr/bin/npx http-server dist -p 4200 -g
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=socialai-admin

# Security hardening
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=yes
ReadWritePaths=/home/socialai/SocialAi

[Install]
WantedBy=multi-user.target
```

Or serve via Nginx (recommended - see Nginx configuration below).

### 7. Nginx Reverse Proxy Configuration

#### 7.1 Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/socialai
```

```nginx
# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name your-vps-domain.com;

    # ACME challenge for Let's Encrypt
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Redirect all other traffic to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name your-vps-domain.com;

    # SSL Configuration (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/your-vps-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-vps-domain.com/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/your-vps-domain.com/chain.pem;

    # SSL Security
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_stapling on;
    ssl_stapling_verify on;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/m;
    limit_req_zone $binary_remote_addr zone=admin_limit:10m rate=50r/m;

    # Backend API Proxy
    location /api/ {
        limit_req zone=api_limit burst=20 nodelay;

        proxy_pass http://localhost:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # CORS Headers
        add_header Access-Control-Allow-Origin "https://your-vercel-domain.vercel.app" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization" always;
        add_header Access-Control-Allow-Credentials "true" always;

        # Handle preflight
        if ($request_method = 'OPTIONS') {
            return 204;
        }

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Admin Console
    location /admin/ {
        limit_req zone=admin_limit burst=10 nodelay;

        alias /home/socialai/SocialAi/apps/admin/dist/;
        try_files $uri $uri/ /admin/index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Admin API (if admin needs separate API endpoint)
    location /admin-api/ {
        limit_req zone=admin_limit burst=10 nodelay;
        
        proxy_pass http://localhost:3000/admin-api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Assets
    location /assets/ {
        alias /home/socialai/SocialAi/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }

    # Deny access to sensitive files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    location ~ ^/(\.env|\.git|\.gitignore|package\.json|package-lock\.json) {
        deny all;
        access_log off;
        log_not_found off;
    }
}
```

#### 7.2 Enable Configuration

```bash
# Create certbot directory
sudo mkdir -p /var/www/certbot

# Test configuration
sudo nginx -t

# Enable site
sudo ln -s /etc/nginx/sites-available/socialai /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Restart Nginx
sudo systemctl restart nginx
```

### 8. SSL/TLS Setup with Let's Encrypt

#### 8.1 Obtain SSL Certificate

```bash
# Stop nginx temporarily for standalone mode
sudo systemctl stop nginx

# Obtain certificate
sudo certbot certonly --standalone -d your-vps-domain.com

# Or use webroot mode (nginx running)
sudo certbot certonly --webroot -w /var/www/certbot -d your-vps-domain.com

# Start nginx
sudo systemctl start nginx
```

#### 8.2 Auto-Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Certbot automatically adds a cron job for renewal
# Verify it's there:
sudo systemctl list-timers | grep certbot
```

#### 8.3 Reload Nginx on Certificate Renewal

Create renewal hook:

```bash
sudo nano /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh
```

```bash
#!/bin/bash
systemctl reload nginx
```

```bash
sudo chmod +x /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh
```

### 9. Firewall Configuration

#### 9.1 Install and Configure UFW

```bash
# Install UFW (if not installed)
sudo apt install -y ufw

# Default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH (IMPORTANT: Do this first!)
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status verbose
```

### 10. Security Hardening

#### 10.1 Disable Root SSH Login

```bash
sudo nano /etc/ssh/sshd_config
```

Update these settings:

```conf
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
```

Restart SSH:

```bash
sudo systemctl restart sshd
```

#### 10.2 Install and Configure Fail2Ban

```bash
# Install fail2ban
sudo apt install -y fail2ban

# Create local configuration
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local
```

Update configuration:

```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5
destemail = your-email@example.com
sendername = Fail2Ban
action = %(action_mwl)s

[sshd]
enabled = true
port = 22
logpath = /var/log/auth.log

[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log

[nginx-limit-req]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log
```

Start Fail2Ban:

```bash
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
sudo fail2ban-client status
```

#### 10.3 Automatic Security Updates

```bash
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

#### 10.4 Node Process Isolation

All systemd service files include security hardening:
- `NoNewPrivileges=true` - Prevents privilege escalation
- `PrivateTmp=true` - Private /tmp directory
- `ProtectSystem=strict` - Read-only system directories
- `ProtectHome=yes` - Inaccessible home directories
- `RestrictRealtime=true` - No realtime scheduling
- `RestrictNamespaces=true` - Restricts namespace creation

#### 10.5 SQL Injection Prevention

The application uses parameterized queries with pg library:

```javascript
// Always use parameterized queries
const result = await client.query(
  'SELECT * FROM users WHERE id = $1',
  [userId]
);

// NEVER concatenate user input
// BAD: `SELECT * FROM users WHERE id = ${userId}`
```

#### 10.6 Regular Security Audits

```bash
# NPM audit
cd /home/socialai/SocialAi
npm audit

# Update dependencies
npm audit fix

# Check for outdated packages
npm outdated
```

### 11. Monitoring and Logging

#### 11.1 View Service Logs

```bash
# Backend logs
sudo journalctl -u socialai-backend -f

# All workers logs
sudo journalctl -u socialai-* -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-15-main.log
```

#### 11.2 Log Rotation

Nginx logs are rotated automatically. For application logs:

```bash
sudo nano /etc/logrotate.d/socialai
```

```
/var/log/socialai/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 socialai socialai
    sharedscripts
    postrotate
        systemctl reload socialai-backend > /dev/null 2>&1 || true
    endscript
}
```

### 12. Deployment Updates

#### 12.1 Pull Latest Changes

```bash
cd /home/socialai/SocialAi
git pull origin main
npm install
```

#### 12.2 Rebuild Admin (if changed)

```bash
cd apps/admin
npm run build
```

#### 12.3 Restart Services

```bash
# Restart backend
sudo systemctl restart socialai-backend

# Restart all workers
sudo systemctl restart socialai-farcaster-worker
sudo systemctl restart socialai-reddit-worker
sudo systemctl restart socialai-ai-worker
sudo systemctl restart socialai-ethereum-worker
sudo systemctl restart socialai-base-worker
sudo systemctl restart socialai-solana-worker
sudo systemctl restart socialai-search-worker

# Or restart all at once
sudo systemctl restart socialai-*
```

#### 12.4 Zero-Downtime Deployment (Advanced)

For zero-downtime deployments, use PM2 instead of systemd:

```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start node/socialai.node.js --name socialai-backend
pm2 start workers/farcaster.worker.js --name farcaster-worker
# ... repeat for all workers

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup

# Reload without downtime
pm2 reload all
```

---

## Deployment Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                          INTERNET TRAFFIC                               │
└───────────────────────────┬────────────────────────────────────────────┘
                            │
                ┌───────────▼──────────┐
                │    DNS Resolution    │
                │  your-domain.com     │
                └───────┬──────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
┌───────▼────────┐              ┌───────▼────────┐
│  Public App    │              │   API/Admin    │
│  (Vercel CDN)  │              │   (OVH VPS)    │
│                │              │                │
│ • Static SSR   │◄─────────────┤ • Backend API  │
│ • Profiles     │  API Proxy   │ • Admin Panel  │
│ • Timelines    │              │ • Workers      │
│ • Assets       │              │                │
└────────────────┘              └───────┬────────┘
                                        │
                        ┌───────────────┴───────────────┐
                        │                               │
                ┌───────▼────────┐              ┌───────▼────────┐
                │ Nginx (443/80) │              │  PostgreSQL    │
                │  Reverse Proxy │              │   (Port 5432)  │
                │                │              │                │
                │ • SSL Term.    │              │ • Users        │
                │ • Rate Limit   │              │ • Profiles     │
                │ • Security     │              │ • Posts        │
                └───────┬────────┘              │ • Embeddings   │
                        │                       │ • pgvector     │
                ┌───────┴────────┐              └────────────────┘
                │                │
        ┌───────▼─────┐  ┌──────▼──────┐
        │   Backend   │  │    Admin    │
        │ (Port 3000) │  │ (Nginx/4200)│
        │             │  │             │
        │ • API       │  │ • Dashboard │
        │ • Auth      │  │ • Controls  │
        │ • Healdec   │  │ • Monitoring│
        └──────┬──────┘  └─────────────┘
               │
        ┌──────▼──────────────────────────────────┐
        │        Worker Orchestrator               │
        │      (socialai.node.js)                  │
        │                                          │
        │  ┌────────────────────────────────────┐ │
        │  │      Parallel Workers (systemd)    │ │
        │  │                                    │ │
        │  │  • Farcaster Worker               │ │
        │  │  • Reddit Worker                  │ │
        │  │  • Ethereum RPC Worker            │ │
        │  │  • BASE RPC Worker                │ │
        │  │  • Solana RPC Worker              │ │
        │  │  • Search Worker                  │ │
        │  │  • AI Worker (SmartBrain)         │ │
        │  └────────┬───────────────────────────┘ │
        └───────────┼─────────────────────────────┘
                    │
        ┌───────────▼────────────────┐
        │   External Services        │
        │                            │
        │  • Farcaster Hub           │
        │  • SmartBrain API          │
        │  • Ethereum RPC            │
        │  • BASE RPC                │
        │  • Solana RPC              │
        │  • Reddit API              │
        └────────────────────────────┘

Traffic Flow:
──────────►  User requests
- - - - - ►  Internal service calls
◄─────────►  Database queries
```

---

## Final Checklist

Before going live, verify all the following:

### ✅ Pre-Deployment

- [ ] All environment variables configured correctly
- [ ] Database schema applied successfully
- [ ] pgvector extension enabled in PostgreSQL
- [ ] API keys and secrets generated and stored securely
- [ ] Domain DNS properly configured
- [ ] SSL certificates obtained and valid

### ✅ Vercel (Public App)

- [ ] Public app builds successfully
- [ ] Environment variables set in Vercel dashboard
- [ ] Domain connected and SSL provisioned
- [ ] API proxy routes working (`/api/*` → VPS)
- [ ] SSR routes rendering correctly (`/profiles/*`, `/timeline/*`)
- [ ] Static assets cached properly
- [ ] Security headers applied
- [ ] SEO meta tags present on all pages

### ✅ OVH VPS (Backend & Workers)

- [ ] All services running: `sudo systemctl status socialai-*`
- [ ] Backend API responding: `curl https://your-domain.com/api/health`
- [ ] Admin console accessible: `https://your-domain.com/admin`
- [ ] PostgreSQL accepting connections
- [ ] All 7 workers running and healthy
- [ ] Nginx reverse proxy working
- [ ] SSL certificate valid and auto-renewal configured
- [ ] Firewall (UFW) configured and enabled
- [ ] Fail2Ban active and monitoring
- [ ] SSH hardened (no root login, key-only auth)
- [ ] Logs rotating properly

### ✅ Security

- [ ] No secrets in git repository
- [ ] JWT_SECRET is strong and unique
- [ ] Database password is strong
- [ ] SQL queries use parameterization (no concatenation)
- [ ] CORS configured correctly
- [ ] Rate limiting enabled and tested
- [ ] Security headers present in responses
- [ ] HTTPS enforced (HTTP redirects to HTTPS)
- [ ] Fail2Ban configured for SSH and Nginx
- [ ] Regular security updates enabled

### ✅ Monitoring & Logs

- [ ] Systemd services configured to restart on failure
- [ ] Logs accessible via journalctl
- [ ] Nginx access/error logs being written
- [ ] Log rotation configured
- [ ] Database logs accessible
- [ ] Worker health monitoring in admin console

### ✅ Performance

- [ ] Database indexes created
- [ ] PostgreSQL tuned for VPS resources
- [ ] Nginx caching enabled for static assets
- [ ] Vercel Edge caching configured
- [ ] CDN serving static assets
- [ ] gzip/brotli compression enabled

### ✅ Functionality

- [ ] Public profiles loading correctly
- [ ] Timelines rendering with data
- [ ] Identity claim flow working
- [ ] Admin console accessible and functional
- [ ] Feature flags toggling correctly
- [ ] Workers syncing data successfully
- [ ] Search functionality working
- [ ] AI features operational (if enabled)

### ✅ External Integrations

- [ ] Farcaster Hub connection working
- [ ] SmartBrain API responding
- [ ] Ethereum RPC accessible
- [ ] BASE RPC accessible
- [ ] Solana RPC accessible
- [ ] Reddit API working (if enabled)

### ✅ Documentation

- [ ] README.md updated with production URLs
- [ ] Environment variables documented
- [ ] Deployment process documented
- [ ] Runbook for common issues created
- [ ] Team access credentials shared securely

---

## Troubleshooting

### Backend Not Starting

```bash
# Check service status
sudo systemctl status socialai-backend

# View logs
sudo journalctl -u socialai-backend -n 50

# Check if port 3000 is in use
sudo lsof -i :3000

# Verify environment variables
sudo systemctl cat socialai-backend
```

### Worker Failures

```bash
# Check specific worker
sudo systemctl status socialai-farcaster-worker

# Restart failed worker
sudo systemctl restart socialai-farcaster-worker

# View worker logs
sudo journalctl -u socialai-farcaster-worker -f
```

### Database Connection Issues

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test connection
psql -U socialai_user -d socialai -c "SELECT 1;"

# Check connections
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity;"
```

### Nginx Issues

```bash
# Test configuration
sudo nginx -t

# Reload configuration
sudo systemctl reload nginx

# Check error logs
sudo tail -f /var/log/nginx/error.log
```

### SSL Certificate Issues

```bash
# Check certificate expiry
sudo certbot certificates

# Force renewal
sudo certbot renew --force-renewal

# Test renewal
sudo certbot renew --dry-run
```

---

## Maintenance Tasks

### Daily

- [ ] Check service health: `sudo systemctl status socialai-*`
- [ ] Monitor disk space: `df -h`
- [ ] Check logs for errors: `sudo journalctl -p err -n 50`

### Weekly

- [ ] Review Nginx access logs for anomalies
- [ ] Check fail2ban banned IPs: `sudo fail2ban-client status sshd`
- [ ] Verify database backups
- [ ] Review worker sync performance

### Monthly

- [ ] Update system packages: `sudo apt update && sudo apt upgrade`
- [ ] Review and rotate logs
- [ ] Audit npm dependencies: `npm audit`
- [ ] Review SSL certificate status: `sudo certbot certificates`
- [ ] Database vacuum and analyze: `VACUUM ANALYZE;`

---

## Support

For issues or questions:

- **GitHub Issues**: https://github.com/SMSDAO/SocialAi/issues
- **Documentation**: https://github.com/SMSDAO/SocialAi/tree/main/docs
- **Community**: [Your community channel]

---

## License

This deployment guide is part of the SocialAi project, licensed under MIT License.

---

**Last Updated**: January 2026  
**Version**: 0.1.0  
**Maintained By**: SocialAi Team
