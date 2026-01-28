# SocialAi Installation & Setup Guide

This guide will help you set up and run the complete SocialAi v0.1 system.

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Git

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/SMSDAO/SocialAi.git
cd SocialAi

# Install dependencies (generates new lockfile with secure versions)
npm install
```

**Note**: The root `package-lock.json` is not included in the repository to ensure fresh dependency resolution with the latest secure versions (Angular 19.2.18, Astro 5.15.8). It will be automatically generated when you run `npm install`.

### 2. Database Setup

```bash
# Create database
createdb socialai

# Or using psql
psql -U postgres
CREATE DATABASE socialai;
\q

# Run schema
psql -U postgres -d socialai -f db/schema.sql
```

### 3. Environment Configuration

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### 4. Start the System

#### Option A: Start Everything (Recommended for Development)

```bash
# Terminal 1: Start Backend + Workers
npm run dev

# Terminal 2: Start Public App
npm run dev:public

# Terminal 3: Start Admin App
npm run dev:admin
```

#### Option B: Start Components Individually

```bash
# Start Backend Orchestrator + Workers
cd node
npm install
npm start

# Start Public App (Astro)
cd apps/public
npm install
npm run dev

# Start Admin App (Angular)
cd apps/admin
npm install
npm start
```

## Accessing the Applications

- **Backend API**: http://localhost:3000
- **Public App**: http://localhost:4321
- **Admin Console**: http://localhost:4200

## System Architecture

### Components

1. **Backend (node/socialai.node.js)**
   - One-file orchestrator
   - Healdec auto-healing engine
   - Worker manager
   - API gateway
   - SSR renderer
   - SmartBrain integration

2. **Workers (workers/)**
   - Farcaster Worker: Syncs Farcaster Hub data
   - Reddit Worker: Syncs Reddit content
   - Ethereum RPC: Ethereum blockchain interactions
   - BASE RPC: BASE blockchain interactions
   - Solana RPC: Solana blockchain interactions
   - Search Worker: Search indexing
   - AI Worker: AI processing and embeddings

3. **Public App (apps/public)**
   - Astro + Vite
   - SEO-optimized pages
   - Profile pages
   - Timelines
   - Claim flow
   - SSR support

4. **Admin App (apps/admin)**
   - Angular 17+
   - Feature flags management
   - Sync controls
   - Worker health monitoring
   - System dashboard

### Database Schema

- **users**: User accounts
- **profiles**: User profile information
- **posts**: Internal posts
- **external_posts**: Posts from external sources (Farcaster, Reddit)
- **follows**: Social graph connections
- **likes**: User interactions
- **claims**: Identity claims and verification
- **embeddings**: AI vector embeddings
- **feature_flags**: Feature toggle states
- **settings**: System configuration

## API Endpoints

### Health & System

- `GET /health` - System health check
- `GET /api/workers/status` - Worker status

### Users & Profiles

- `GET /api/users` - List users
- `GET /api/users/:id` - Get user by ID
- `GET /api/profiles` - List profiles
- `GET /api/profiles/:username` - Get profile by username

### Posts & Timeline

- `GET /api/posts` - List posts
- `GET /api/posts/:id` - Get post by ID
- `GET /api/external-posts` - List external posts (query: ?source=farcaster)
- `GET /api/timeline/:username` - Get user timeline

### Feature Flags

- `GET /api/feature-flags` - List all feature flags
- `PUT /api/feature-flags/:name` - Update feature flag

### Settings

- `GET /api/settings` - List all settings

### AI Features

- `GET /api/ai/summary/:postId` - Generate post summary
- `GET /api/ai/recommendations/:userId` - Get AI recommendations

## Configuration

### Environment Variables

See `.env.example` for all available configuration options.

### Feature Flags

Feature flags can be toggled via:
1. Admin console UI (http://localhost:4200/feature-flags)
2. API endpoint: `PUT /api/feature-flags/:name`
3. Direct database updates

Available flags:
- `farcaster_sync` - Enable Farcaster data synchronization
- `reddit_sync` - Enable Reddit data synchronization
- `ai_summaries` - Enable AI-powered content summaries
- `ai_recommendations` - Enable AI-powered recommendations
- `public_profiles` - Enable public profile pages
- `identity_claims` - Enable identity claim system
- `search_enabled` - Enable search functionality

## Development

### Building

```bash
# Build all apps
npm run build

# Build individual apps
npm run build:public
npm run build:admin
```

### Testing

Workers include basic health checks and monitoring. The Healdec engine automatically restarts failed workers.

Monitor worker health via:
- Admin console: http://localhost:4200/workers
- API: http://localhost:3000/api/workers/status
- Health endpoint: http://localhost:3000/health

## Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
pg_isready

# Check connection string in .env
echo $DATABASE_URL
```

### Worker Failures

Workers automatically restart on failure (up to 3 times). Check logs for errors:

```bash
# Backend logs show all worker output
npm run dev
```

### Port Conflicts

If ports are in use, modify:
- Backend: `PORT` in `.env` (default: 3000)
- Public app: `server.port` in `apps/public/astro.config.mjs` (default: 4321)
- Admin app: `ng serve --port XXXX` (default: 4200)

## Production Deployment

### Backend

```bash
cd node
npm install --production
node socialai.node.js
```

### Public App (Astro)

```bash
cd apps/public
npm install
npm run build
# Serve the dist/ folder or use the standalone server
node dist/server/entry.mjs
```

### Admin App (Angular)

```bash
cd apps/admin
npm install
npm run build
# Serve the dist/ folder with any static file server
```

## Architecture Details

For detailed architecture information, see [ARCHITECTURE.md](ARCHITECTURE.md).

## License

MIT License - see [LICENSE](LICENSE)

## Support

For issues and questions, please open an issue on GitHub.
