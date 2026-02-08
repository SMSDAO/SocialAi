# SocialAi Documentation

Welcome to the comprehensive documentation for SocialAi - The Open Social Index & Identity Claim Network.

## 📚 Table of Contents

### Getting Started
1. [Installation & Setup Guide](INSTALLATION.md) - Complete setup instructions for development and production
2. [Quick Start](#quick-start) - Get up and running in minutes
3. [System Requirements](#system-requirements)

### Architecture & Design
4. [Architecture Overview](ARCHITECTURE.md) - Detailed system architecture, components, and data flows
5. [UI/UX Specifications](UIUXSPECTS.md) - User interface and user experience guidelines
6. [Database Schema](#database-schema) - Database structure and relationships

### API Documentation
7. [API Reference](API.md) - Complete REST API documentation with examples
8. [Authentication](#authentication) - Farcaster and SIWE authentication flows
9. [Rate Limiting](#rate-limiting) - API rate limits and best practices

### Development
10. [Development Guide](DEVELOPMENT.md) - Development workflow and best practices
11. [Contributing Guidelines](CONTRIBUTING.md) - How to contribute to the project
12. [Testing Guide](TESTING.md) - Testing strategies and commands
13. [Troubleshooting](TROUBLESHOOTING.md) - Common issues and solutions

### Deployment
14. [Deployment Guide](DEPLOYMENT.md) - Production deployment instructions
15. [Environment Configuration](#environment-configuration)
16. [Monitoring & Logging](#monitoring--logging)

### Security
17. [Security Summary](../SECURITY.md) - Security vulnerabilities and remediation
18. [Security Best Practices](#security-best-practices)

---

## Quick Start

Get SocialAi running in 5 minutes:

```bash
# 1. Clone the repository
git clone https://github.com/SMSDAO/SocialAi.git
cd SocialAi

# 2. Install dependencies
npm install

# 3. Setup database
createdb socialai
psql -U postgres -d socialai -f db/schema.sql

# 4. Configure environment
cp .env.example .env
# Edit .env with your settings

# 5. Start the system
npm run dev                # Backend + Workers
npm run dev:public         # Public App (port 4321)
npm run dev:admin          # Admin Console (port 4200)
```

**Access Points:**
- 🔌 Backend API: http://localhost:3000
- 🌐 Public App: http://localhost:4321
- ⚙️ Admin Console: http://localhost:4200

For detailed instructions, see [INSTALLATION.md](INSTALLATION.md).

---

## System Requirements

### Prerequisites
- **Node.js**: 18.x or higher
- **npm**: 8.x or higher
- **PostgreSQL**: 14.x or higher
- **Git**: 2.x or higher

### Recommended System Resources
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 10GB minimum for database and logs
- **CPU**: 2 cores minimum, 4 cores recommended

### Optional Dependencies
- **Docker**: For containerized deployment
- **Redis**: For caching (future enhancement)

---

## System Architecture Overview

SocialAi consists of five major layers:

### 1. Public Layer (Astro + Vite)
SEO-optimized user-facing application with:
- Profile pages
- Social timelines
- Identity claim flow
- Landing pages

### 2. Admin Layer (Angular)
Administrative console for:
- Feature flag management
- Sync controls
- Worker health monitoring
- System dashboard

### 3. Backend (One-File Node)
Central orchestrator managing:
- Healdec auto-healing engine
- Worker management
- API gateway
- SSR rendering
- SmartBrain AI integration

### 4. Workers (Parallel Processing)
Seven specialized workers:
- **Farcaster Worker**: Syncs Farcaster Hub data
- **Reddit Worker**: Syncs Reddit content
- **Ethereum RPC**: Ethereum blockchain interactions
- **BASE RPC**: BASE blockchain interactions
- **Solana RPC**: Solana blockchain interactions
- **Search Worker**: Search indexing
- **AI Worker**: AI processing and embeddings

### 5. Database (PostgreSQL)
Stores all application data:
- Users and profiles
- Posts (internal and external)
- Social graph (follows, likes)
- Identity claims
- AI embeddings
- System configuration

For detailed architecture information, see [ARCHITECTURE.md](ARCHITECTURE.md).

---

## Database Schema

### Core Tables

**Users**
- Primary user accounts
- Links to Farcaster ID and Ethereum address
- ENS name mapping

**Profiles**
- User profile information
- Username, bio, avatar, banner
- Claim and verification status

**Posts**
- Internal posts created by users
- Threading support (parent_id, root_id)
- Engagement metrics

**External Posts**
- Posts from external sources (Farcaster, Reddit)
- Source attribution
- Sync timestamps

**Follows**
- Social graph connections
- Follower/following relationships

**Likes**
- User interactions with posts
- Supports both internal and external posts

**Claims**
- Identity verification records
- Farcaster and Ethereum signatures
- Verification status

**Embeddings**
- AI vector embeddings (1536 dimensions)
- Content representations for similarity search
- Metadata for filtering

**Feature Flags**
- System feature toggles
- Enable/disable functionality dynamically

**Settings**
- System configuration
- JSON-based flexible storage

For the complete schema, see `db/schema.sql`.

---

## Authentication

SocialAi supports two authentication methods:

### Farcaster Sign-In
1. User initiates sign-in
2. Farcaster client generates signature
3. Backend verifies signature
4. JWT token issued
5. User authenticated

### SIWE (Sign-In with Ethereum)
1. User connects wallet
2. Message generated for signing
3. User signs with private key
4. Backend verifies signature
5. JWT token issued
6. User authenticated

For implementation details, see [API.md](API.md#authentication).

---

## Rate Limiting

To ensure fair usage and system stability, the API implements rate limiting:

- **Default**: 100 requests per minute per IP address
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- **Response**: 429 status code when limit exceeded
- **Configuration**: Adjustable via settings table

For more information, see [API.md](API.md#rate-limiting).

---

## Environment Configuration

Key environment variables:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/socialai

# Server
PORT=3000
NODE_ENV=development

# Feature Flags
FARCASTER_SYNC_ENABLED=true
REDDIT_SYNC_ENABLED=false
AI_SUMMARIES_ENABLED=true

# External Services
FARCASTER_HUB_URL=https://hub.farcaster.xyz
REDDIT_API_KEY=your_reddit_api_key
OPENAI_API_KEY=your_openai_api_key

# Security
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:4321
```

For complete environment configuration, see `.env.example` and [INSTALLATION.md](INSTALLATION.md#environment-configuration).

---

## Monitoring & Logging

### Health Checks
Monitor system health via:
- **API Endpoint**: `GET /health`
- **Worker Status**: `GET /api/workers/status`
- **Admin Console**: http://localhost:4200/workers

### Logging
- Backend logs to stdout
- Worker logs included in backend output
- Structured logging for parsing
- Log levels: INFO, WARN, ERROR

### Healdec Auto-Healing
The Healdec engine automatically:
- Monitors worker health (every 30 seconds)
- Restarts failed workers (max 3 attempts)
- Validates changes before applying
- Rolls back problematic updates

For troubleshooting, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md).

---

## Security Best Practices

### Development
- Never commit secrets to version control
- Use `.env` files for local configuration
- Keep dependencies up to date
- Run `npm audit` regularly

### Production
- Use HTTPS/TLS for all connections
- Configure strict CORS policies
- Use strong database passwords
- Rotate API keys regularly
- Enable security headers (Helmet.js)
- Monitor for suspicious activity
- Keep system updated with security patches

For detailed security information, see [SECURITY.md](../SECURITY.md).

---

## Documentation Structure

```
docs/
├── README.md              # This file - main table of contents
├── INSTALLATION.md        # Complete setup guide
├── ARCHITECTURE.md        # System architecture
├── UIUXSPECTS.md         # UI/UX specifications
├── API.md                # API reference
├── DEVELOPMENT.md        # Development guide
├── CONTRIBUTING.md       # Contributing guidelines
├── TESTING.md            # Testing strategies
├── TROUBLESHOOTING.md    # Common issues
└── DEPLOYMENT.md         # Production deployment
```

---

## Getting Help

### Documentation
Start with the documentation most relevant to your needs:
- **New users**: [INSTALLATION.md](INSTALLATION.md)
- **Developers**: [DEVELOPMENT.md](DEVELOPMENT.md)
- **Contributors**: [CONTRIBUTING.md](CONTRIBUTING.md)
- **DevOps**: [DEPLOYMENT.md](DEPLOYMENT.md)

### Support
- **Issues**: https://github.com/SMSDAO/SocialAi/issues
- **Discussions**: https://github.com/SMSDAO/SocialAi/discussions

---

## License

MIT License - see [LICENSE](../LICENSE)

---

*Documentation Version: 1.0*  
*Last Updated: 2026-02-07*
