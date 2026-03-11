# 🌐 SocialAi  
### The Open Social Index & Identity Claim Network

SocialAi is a lightweight, AI‑powered social discovery engine that mirrors public Farcaster activity, blends optional Reddit timelines, and exposes SEO‑optimized public profiles that users can claim by verifying their Farcaster identity.

It is built on a **parallel, auto‑healing, one‑file node architecture** powered by Healdec and SmartBrain.

**Built with Node.js 24+ | Production-Ready | Modern GitHub-Style UI**

---

## 📸 Screenshots

### Public App
<!-- Screenshot: Public timeline and profile pages -->
> Screenshot coming soon. Once available, add it as `docs/screenshots/public-app.png` and replace this note with an embedded image.
*Modern GitHub-inspired dark theme for public profiles and timelines*

### Admin Console
<!-- Screenshot: Admin dashboard with metrics -->
> Screenshot coming soon. Once available, add it as `docs/screenshots/admin-dashboard.png` and replace this note with an embedded image.
*Real-time system metrics and worker health monitoring*

### Desktop Admin App
<!-- Screenshot: Windows desktop app -->
> Screenshot coming soon. Once available, add it as `docs/screenshots/desktop-admin.png` and replace this note with an embedded image.
*Native Windows admin app built with Tauri*

---

## ✨ Features

### 🔍 Public Social Index
- SEO‑optimized profiles, posts, timelines  
- Google‑indexable pages  
- Zero‑JS by default (Astro + Vite)  
- Fast SSR for timelines and profiles  
- GitHub-inspired dark theme UI

### 🪪 Identity Claim System
- Farcaster Sign‑In  
- Wallet verification (SIWE)  
- ENS mapping  
- Claim → unlock editing + AI tools  

### 🌐 Multi‑Network Sync
- Farcaster Hub ingestion  
- Optional Reddit sync  
- Future: Lens, Bluesky, Zora  
- Admin‑controlled feed toggles  

### 🤖 SocialAi Brain
- Embeddings + vector search  
- Timeline summaries  
- Profile optimization  
- Topic clustering  
- Recommendations  

### 🧩 Social Graph
- Follow / unfollow  
- Likes  
- Saved posts  
- Mutuals  

### 🛠 Admin Console
- Feature flags  
- Sync toggles  
- Logs  
- Worker health  
- Abuse controls  
- **NEW: Desktop Windows app (Tauri)**

---

## 🧱 Architecture

For a detailed architecture diagram and component descriptions, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

### Public Layer (Astro + Vite)
- SEO pages  
- Profiles  
- Timelines  
- Claim flow  
- Landing pages  

### Admin Layer (Angular)
- Feature flags  
- Sync controls  
- Worker monitoring  
- System health  

### Backend (One‑File SocialAi Node)
- Healdec engine  
- Parallel chain workers  
- AI worker  
- Search worker  
- Sync worker  
- RPC workers  

### Database (Postgres)
- Users  
- Profiles  
- Posts  
- External posts  
- Follows  
- Likes  
- Claims  
- Embeddings  
- Feature flags  
- Settings  

---

## 🚀 Getting Started

### Prerequisites
- **Node.js 24+** (specified in `.nvmrc`)
- PostgreSQL 12+
- npm 10+

### One-Click Setup

```bash
git clone https://github.com/SMSDAO/SocialAi.git
cd SocialAi

# Automated setup (zero-error, one-click)
npm run setup
```

The setup script will:
- ✅ Check Node.js version (24+)
- ✅ Create `.env` from `.env.example`
- ✅ Install all dependencies
- ✅ Validate configuration

### Manual Setup

```bash
# 1. Clone the repository
git clone https://github.com/SMSDAO/SocialAi.git
cd SocialAi

# 2. Use Node.js 24+
nvm use  # Reads from .nvmrc

# 3. Install dependencies
npm install

# 4. Setup database
createdb socialai
psql -U postgres -d socialai -f db/schema.sql

# 5. Configure environment
cp .env.example .env
# Edit .env with your settings (see .env.example for all options)

# 6. Start the system
npm run dev                # Backend + Workers
npm run dev:public         # Public App (port 4321)
npm run dev:admin          # Admin Console (port 4200)
npm run dev:desktop        # Desktop Admin App (Windows)
```

> Note: These manual steps mirror what the automated setup script (`npm run setup`) does internally. You can either run `npm run setup` or follow the commands above manually—both paths achieve the same result.
### Access Points

- 🔌 **Backend API**: http://localhost:3000
- 🌐 **Public App**: http://localhost:4321
- ⚙️ **Admin Console**: http://localhost:4200
- 🖥️ **Desktop Admin**: Native Windows app (via Tauri)

### Desktop Admin App (Windows)

Build the native Windows admin app:

```bash
# Prerequisites: Rust toolchain + Node.js 24+
npm run build:desktop:windows
```

The installer will be created in `desktop-admin/src-tauri/target/release/bundle/`:
- `admin.msi` - MSI installer
- `admin-setup.exe` - NSIS installer

For detailed desktop app documentation, see [desktop-admin/README.md](desktop-admin/README.md).

For detailed setup instructions, see [docs/INSTALLATION.md](docs/INSTALLATION.md).

---

## 🚀 Deployment

### Vercel Deployment (Frontend)

The public frontend is optimized for Vercel deployment with Node.js 24 runtime.

#### Quick Deploy to Vercel

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Deploy**:
```bash
vercel
```

The `vercel.json` configuration is already set up with:
- ✅ Node.js 24 runtime
- ✅ Optimized build settings
- ✅ Correct output directory
- ✅ Environment variable placeholders

#### Environment Variables for Vercel

Configure these in your Vercel project settings (frontend only):
- `PUBLIC_API_URL` - Backend API URL (e.g., https://api.yourdomain.com)

**Note**: Backend secrets (`DATABASE_URL`, `JWT_SECRET`, `SESSION_SECRET`) should only be configured in your backend deployment environment (Railway, Render, etc.), not in Vercel frontend settings.

### Backend Deployment

The backend can be deployed to any Node.js 24+ hosting provider:

- **Recommended**: Railway, Render, Fly.io
- **Requirements**: Node.js 24+, PostgreSQL 12+
- **Build command**: `npm install`
- **Start command**: `npm run dev`

### GitHub Actions CI/CD

Automated workflows are configured in `.github/workflows/`:
- ✅ **CI**: Runs on every push/PR (Node 24 checks, builds)
- ⚠️ **Deploy**: Workflow exists and currently runs build checks only; Vercel deployment is not yet implemented (TODO and will require Vercel token configuration once enabled).

### Production Checklist

- [ ] Set `NODE_ENV=production` in environment
- [ ] Configure production database
- [ ] Set strong JWT and session secrets
- [ ] Configure CORS origins
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging
- [ ] Review security settings

For detailed deployment instructions, see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

---

## 📚 Documentation

### Core Documentation
- **[📖 Documentation Index](docs/README.md)** - Complete documentation table of contents
- **[⚙️ Installation Guide](docs/INSTALLATION.md)** - Complete setup and deployment guide
- **[🏗️ Architecture](docs/ARCHITECTURE.md)** - System architecture and component diagrams
- **[🎨 UI/UX Specifications](docs/UIUXSPECTS.md)** - User interface and user experience guidelines
- **[🔌 API Reference](docs/API.md)** - Full API documentation with examples

### Developer Resources
- **[💻 Development Guide](docs/DEVELOPMENT.md)** - Development workflow and best practices
- **[🤝 Contributing Guidelines](docs/CONTRIBUTING.md)** - How to contribute to the project
- **[✅ Testing Guide](docs/TESTING.md)** - Testing strategies and commands
- **[🔧 Troubleshooting](docs/TROUBLESHOOTING.md)** - Common issues and solutions

### Operations
- **[🚀 Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment instructions
- **[🔒 Security Summary](SECURITY.md)** - Security vulnerabilities and remediation

For a comprehensive overview and quick navigation, start with the **[Documentation Index](docs/README.md)**.