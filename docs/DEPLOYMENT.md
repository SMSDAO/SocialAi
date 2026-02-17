# Production Deployment Guide

This guide covers deploying SocialAi to production environments.

**⚠️ IMPORTANT: Node.js 24+ Required**
All deployment targets must support Node.js 24 or higher. See [Node 24+ Requirements](#node-24-requirements) section below.

---

## Table of Contents

1. [Node 24+ Requirements](#node-24-requirements)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Vercel Deployment (Frontend)](#vercel-deployment-frontend)
4. [Backend Deployment Options](#backend-deployment-options)
5. [Desktop Admin Distribution](#desktop-admin-distribution)
6. [Database Setup](#database-setup)
7. [Environment Configuration](#environment-configuration)
8. [SSL/TLS Setup](#ssltls-setup)
9. [Monitoring & Logging](#monitoring--logging)
10. [Backup & Recovery](#backup--recovery)
11. [Scaling](#scaling)

---

## Node 24+ Requirements

SocialAi requires Node.js 24 or higher for all components.

### Why Node.js 24+?
- Modern JavaScript features
- Performance improvements
- Enhanced security
- Long-term support

### Verifying Node Version

```bash
node --version  # Should output v24.x.x or higher
```

### Platform Support

**Verified Platforms with Node 24+ Support:**
- ✅ Vercel (default for frontend)
- ✅ Railway
- ✅ Render
- ✅ Fly.io
- ✅ AWS EC2/ECS
- ✅ Google Cloud Run
- ✅ Azure App Service
- ✅ DigitalOcean App Platform

**Not Recommended:**
- ❌ Platforms that don't support Node 24+
- ❌ Heroku (unless updated runtime available)

---

## Pre-Deployment Checklist

Before deploying to production:

### Node.js Version
- [ ] Confirm Node.js 24+ on target platform
- [ ] Test build with Node 24+
- [ ] Update `.nvmrc` if needed (default: 24.13.0)

### Security

- [ ] Change all default passwords
- [ ] Generate strong JWT secret
- [ ] Configure CORS for production domains
- [ ] Enable HTTPS/TLS
- [ ] Set up firewall rules
- [ ] Disable debug logging
- [ ] Review and update `.env` file
- [ ] Scan for vulnerabilities (`npm audit`)

### Configuration

- [ ] Set `NODE_ENV=production`
- [ ] Configure production database
- [ ] Set up external service APIs (Farcaster, OpenAI, etc.)
- [ ] Configure rate limiting
- [ ] Set up CDN for static assets (optional)
- [ ] Configure email service (optional)

### Testing

- [ ] Run full test suite
- [ ] Test production build locally
- [ ] Verify all environment variables
- [ ] Test database migrations
- [ ] Verify external API connectivity

### Performance

- [ ] Build optimized bundles
- [ ] Minify assets
- [ ] Enable compression
- [ ] Set up caching headers
- [ ] Optimize database queries
- [ ] Add database indexes

---

## Vercel Deployment (Frontend)

The public frontend app is optimized for Vercel with Node.js 24 runtime.

### Quick Deploy

1. **Connect Repository**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select the `SocialAi` project

2. **Configure Build Settings**:
   ```
   Framework Preset: Astro
   Build Command: npm run build:public
   Output Directory: apps/public/dist
   Install Command: npm install
   Node Version: 24.x
   ```

3. **Set Environment Variables**:
   ```
   DATABASE_URL=your_postgres_connection_string
   JWT_SECRET=your_jwt_secret
   SESSION_SECRET=your_session_secret
   API_URL=your_backend_api_url
   OPENAI_API_KEY=your_openai_key (optional)
   NODE_ENV=production
   ```

4. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically build and deploy

### Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Vercel Configuration

The `vercel.json` file is already configured with:
- Node.js 24 runtime
- Optimized build settings
- Correct output directory
- Static file serving

### Custom Domain

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. SSL is automatically provisioned

### Environment Variables

Configure in Vercel Dashboard:
1. Project Settings → Environment Variables
2. Add each variable from `.env.example`
3. Select environment (Production, Preview, Development)
4. Save

**Important**: Never commit secrets to the repository. Use Vercel's environment variable system.

---

## Backend Deployment Options

The backend requires Node.js 24+ and can be deployed to various platforms.

### Recommended: Railway

Railway provides managed PostgreSQL and supports Node.js 24+.

1. **Install Railway CLI**:
```bash
npm install -g @railway/cli
```

2. **Login and Deploy**:
```bash
railway login
railway init
railway up
```

3. **Configure**:
- Add PostgreSQL service
- Set environment variables
- Deploy backend

### Alternative: Render

1. Create new Web Service on [render.com](https://render.com)
2. Connect repository
3. Configure:
   ```
   Build Command: npm install
   Start Command: npm run dev
   Node Version: 24
   ```
4. Add environment variables
5. Deploy

### Alternative: Fly.io

1. Install Fly CLI
2. Create `fly.toml`:
```toml
app = "socialai-backend"

[build]
  [build.env]
    NODE_VERSION = "24"

[env]
  PORT = "3000"

[[services]]
  internal_port = 3000
  protocol = "tcp"
```
3. Deploy: `fly deploy`

---

## Desktop Admin Distribution

The Windows desktop admin app can be distributed to users.

### Building for Windows

On a Windows machine with Node 24+ and Rust:

```bash
npm run build:desktop:windows
```

This creates:
- `admin.msi` - MSI installer
- `admin-setup.exe` - NSIS installer

Located in: `desktop-admin/src-tauri/target/release/bundle/`

### Distribution Options

1. **Direct Download**: Host installer files on your server
2. **GitHub Releases**: Upload as release assets
3. **Microsoft Store**: Submit for distribution (requires developer account)

### Auto-Updates

Configure auto-updates in `desktop-admin/src-tauri/tauri.conf.json`:
```json
{
  "updater": {
    "active": true,
    "endpoints": ["https://yourdomain.com/releases"],
    "dialog": true
  }
}
```

---

## Deployment Options

### Option 1: VPS (Virtual Private Server)
**Best for:** Full control, custom configuration
**Examples:** DigitalOcean, Linode, AWS EC2
**Cost:** $5-50/month

### Option 2: Platform as a Service (PaaS)
**Best for:** Easy deployment, managed infrastructure
**Examples:** Heroku, Render, Railway
**Cost:** $7-25/month

### Option 3: Docker + Container Service
**Best for:** Scalability, portability
**Examples:** AWS ECS, Google Cloud Run, Azure Container Apps
**Cost:** $10-100/month

### Option 4: Serverless
**Best for:** Variable traffic, pay-per-use
**Examples:** Vercel, Netlify, AWS Lambda
**Cost:** $0-50/month (usage-based)

---

## VPS Deployment

### Prerequisites

- Ubuntu 22.04 LTS server
- Root or sudo access
- Domain name pointing to server IP

### 1. Initial Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Create deploy user
sudo adduser deploy
sudo usermod -aG sudo deploy

# Setup firewall
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Switch to deploy user
su - deploy
```

### 2. Install Dependencies

```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL 14
sudo apt-get install -y postgresql postgresql-contrib

# Install Nginx
sudo apt-get install -y nginx

# Install certbot for SSL
sudo apt-get install -y certbot python3-certbot-nginx

# Install PM2 for process management
sudo npm install -g pm2
```

### 3. Setup PostgreSQL

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE socialai;
CREATE USER socialai WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE socialai TO socialai;
\q

# Run schema
psql -U socialai -d socialai -f /path/to/db/schema.sql
```

### 4. Deploy Application

```bash
# Clone repository
cd /home/deploy
git clone https://github.com/SMSDAO/SocialAi.git
cd SocialAi

# Install dependencies
npm install

# Build frontend apps
cd apps/public
npm install
npm run build

cd ../admin
npm install
npm run build

# Configure environment
cd /home/deploy/SocialAi
cp .env.example .env
nano .env  # Edit with production values
```

### 5. Configure PM2

```bash
# Create ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'socialai-backend',
    script: './node/socialai.node.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
EOF

# Start application
pm2 start ecosystem.config.js

# Setup PM2 to start on boot
pm2 startup
pm2 save
```

### 6. Configure Nginx

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/socialai

# Add this configuration:
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Health endpoint
    location /health {
        proxy_pass http://localhost:3000;
    }

    # Admin console (static files)
    location /admin {
        alias /home/deploy/SocialAi/apps/admin/dist;
        try_files $uri $uri/ /admin/index.html;
    }

    # Public app (SSR)
    location / {
        proxy_pass http://localhost:4321;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/socialai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7. Setup SSL

```bash
# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is configured by certbot
# Test renewal
sudo certbot renew --dry-run
```

### 8. Verify Deployment

```bash
# Check backend
curl https://yourdomain.com/health

# Check PM2 status
pm2 status

# Check Nginx status
sudo systemctl status nginx

# Check logs
pm2 logs
```

---

## Docker Deployment

### 1. Create Dockerfile for Backend

```dockerfile
# Dockerfile.backend
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY node/package*.json ./node/
COPY workers/package*.json ./workers/

# Install dependencies
RUN npm install --production

# Copy application files
COPY node/ ./node/
COPY workers/ ./workers/
COPY db/ ./db/

WORKDIR /app/node

EXPOSE 3000

CMD ["node", "socialai.node.js"]
```

### 2. Create Dockerfile for Public App

```dockerfile
# Dockerfile.public
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY apps/public/package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY apps/public/ ./

# Build
RUN npm run build

EXPOSE 4321

CMD ["node", "dist/server/entry.mjs"]
```

### 3. Create Dockerfile for Admin App

```dockerfile
# Dockerfile.admin
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY apps/admin/package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY apps/admin/ ./

# Build
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 4. Create docker-compose.yml

```yaml
version: '3.8'

services:
  db:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: socialai
      POSTGRES_USER: socialai
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./db/schema.sql:/docker-entrypoint-initdb.d/schema.sql
    ports:
      - "5432:5432"
    restart: unless-stopped

  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://socialai:${DB_PASSWORD}@db:5432/socialai
      JWT_SECRET: ${JWT_SECRET}
      PORT: 3000
    ports:
      - "3000:3000"
    depends_on:
      - db
    restart: unless-stopped

  public:
    build:
      context: .
      dockerfile: Dockerfile.public
    environment:
      API_URL: http://backend:3000
    ports:
      - "4321:4321"
    depends_on:
      - backend
    restart: unless-stopped

  admin:
    build:
      context: .
      dockerfile: Dockerfile.admin
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
```

### 5. Deploy with Docker Compose

```bash
# Create .env file
cat > .env << EOF
DB_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret
EOF

# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps

# Stop services
docker-compose down
```

---

## Cloud Platform Deployment

### Heroku

```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login

# Create app
heroku create socialai-app

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main

# Run migrations
heroku run psql $DATABASE_URL < db/schema.sql

# View logs
heroku logs --tail
```

### Railway

1. Connect GitHub repository
2. Add PostgreSQL service
3. Configure environment variables
4. Deploy automatically on push

### Render

1. Connect GitHub repository
2. Create PostgreSQL database
3. Create web service
4. Set environment variables
5. Deploy

---

## Database Setup

### Production Database Configuration

```bash
# Tune PostgreSQL for production
sudo nano /etc/postgresql/14/main/postgresql.conf

# Recommended settings:
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 4MB
min_wal_size = 1GB
max_wal_size = 4GB
max_worker_processes = 4
max_parallel_workers_per_gather = 2
max_parallel_workers = 4
```

### Database Backups

```bash
# Manual backup
pg_dump -U socialai socialai > backup_$(date +%Y%m%d_%H%M%S).sql

# Automated daily backups
cat > /home/deploy/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/deploy/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
pg_dump -U socialai socialai > "$BACKUP_DIR/socialai_$TIMESTAMP.sql"
# Keep only last 7 days
find "$BACKUP_DIR" -name "socialai_*.sql" -mtime +7 -delete
EOF

chmod +x /home/deploy/backup.sh

# Add to crontab
crontab -e
# Add: 0 2 * * * /home/deploy/backup.sh
```

### Database Restore

```bash
# Restore from backup
psql -U socialai socialai < backup_20240128_020000.sql
```

---

## Environment Configuration

### Production .env Example

```bash
# Node Environment
NODE_ENV=production

# Database
DATABASE_URL=postgresql://socialai:secure_password@localhost:5432/socialai

# Server
PORT=3000
CORS_ORIGIN=https://yourdomain.com

# Security
JWT_SECRET=very_long_random_string_at_least_64_characters_long
SESSION_SECRET=another_long_random_string

# Feature Flags
FARCASTER_SYNC_ENABLED=true
REDDIT_SYNC_ENABLED=false
AI_SUMMARIES_ENABLED=true
AI_RECOMMENDATIONS_ENABLED=true

# External Services
FARCASTER_HUB_URL=https://hub.farcaster.xyz
OPENAI_API_KEY=sk-your-production-key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

---

## SSL/TLS Setup

### Let's Encrypt with Certbot

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Verify auto-renewal
sudo certbot renew --dry-run
```

### Manual SSL Certificate

```bash
# Generate private key
openssl genrsa -out private.key 2048

# Generate CSR
openssl req -new -key private.key -out request.csr

# Purchase SSL certificate and install
sudo cp certificate.crt /etc/ssl/certs/
sudo cp private.key /etc/ssl/private/

# Configure Nginx
sudo nano /etc/nginx/sites-available/socialai

# Add SSL configuration:
listen 443 ssl;
ssl_certificate /etc/ssl/certs/certificate.crt;
ssl_certificate_key /etc/ssl/private/private.key;
```

---

## Monitoring & Logging

### Application Monitoring

```bash
# PM2 Monitoring
pm2 monit

# PM2 Web Interface
pm2 install pm2-server-monit
```

### Log Management

```bash
# View PM2 logs
pm2 logs

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# View PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

### Error Tracking

Consider integrating:
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **New Relic** - APM monitoring

### Uptime Monitoring

Setup monitoring with:
- **UptimeRobot** - Free uptime monitoring
- **Pingdom** - Website monitoring
- **StatusCake** - Uptime and performance

---

## Backup & Recovery

### Automated Backup Strategy

1. **Database Backups:**
   - Daily full backups
   - Keep 7 days locally
   - Upload to S3/Cloud Storage

2. **Application Backups:**
   - Version controlled via Git
   - Tagged releases

3. **Environment Backups:**
   - Encrypted `.env` backups
   - Secure storage

### Disaster Recovery Plan

1. **Regular Testing:**
   - Test backups monthly
   - Document restore procedures
   - Time recovery process

2. **Failover Strategy:**
   - Secondary server (optional)
   - Database replication
   - DNS failover

---

## Scaling

### Vertical Scaling (Scale Up)

Upgrade server resources:
- More RAM
- More CPU cores
- Faster storage (SSD)

### Horizontal Scaling (Scale Out)

#### Load Balancing

```nginx
# Nginx load balancer
upstream backend {
    least_conn;
    server backend1.yourdomain.com:3000;
    server backend2.yourdomain.com:3000;
    server backend3.yourdomain.com:3000;
}

server {
    location /api {
        proxy_pass http://backend;
    }
}
```

#### Database Replication

```bash
# Setup read replicas
# Primary database: writes
# Replica databases: reads

# Configure in application:
const primaryDB = new Pool({ host: 'primary.db' });
const replicaDB = new Pool({ host: 'replica.db' });

// Use replica for reads
const users = await replicaDB.query('SELECT * FROM users');

// Use primary for writes
await primaryDB.query('INSERT INTO users ...');
```

#### Caching Layer

```bash
# Install Redis
sudo apt-get install redis-server

# Use in application
const redis = require('redis');
const client = redis.createClient();

// Cache API responses
const cached = await client.get(key);
if (cached) return JSON.parse(cached);

const data = await fetchData();
await client.setex(key, 3600, JSON.stringify(data));
```

---

## Maintenance

### Regular Tasks

**Daily:**
- Check application logs
- Monitor error rates
- Verify backups completed

**Weekly:**
- Review performance metrics
- Check disk space
- Update dependencies (security patches)

**Monthly:**
- Test backup restore
- Review and optimize database
- Update documentation
- Security audit

---

## Rollback Procedure

If deployment fails:

```bash
# Stop application
pm2 stop all

# Restore previous version
git checkout previous-tag
npm install
npm run build

# Restore database (if needed)
psql -U socialai socialai < backup_before_deployment.sql

# Restart application
pm2 restart all
```

---

*Last Updated: 2026-02-07*
