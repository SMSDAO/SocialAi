📘 SocialAi — Engineering Specification & System Overview

SocialAi is a lightweight, AI‑powered social indexing engine that mirrors Farcaster activity, optionally blends Reddit timelines, and exposes SEO‑optimized public profiles that users can claim by verifying their Farcaster identity.
It is built on a parallel, auto‑healing, one‑file Node orchestrator powered by Healdec and SmartBrain.

This document defines the engineering‑level specification for the entire system.

---

🧱 1. Frameworks

Public Layer (SEO‑Optimized)

The public‑facing SocialAi experience is built for speed, indexing, and mobile‑first rendering.

• Astro — primary framework
• Vite — build engine
• React islands (optional interactive components)
• Svelte islands (optional interactive components)


This layer powers:

• Public profiles
• Timelines
• Post pages
• Claim flow
• Landing pages
• Sitemaps


---

Admin Layer

The internal admin console uses a structured, enterprise‑grade framework:

• Angular 18+


Used for:

• Feature flags
• Sync controls
• Worker health
• Abuse management
• System dashboards


---

Backend Layer

The backend is a single orchestrator file:

• Node 22+
• One‑file orchestrator (socialai.node.js)
• Healdec engine (auto‑heal, auto‑update, non‑destructive)
• SmartBrain integration (AI summaries, embeddings, recommendations)


This orchestrator manages:

• Workers
• Schedules
• API
• SSR
• Health checks
• Dependency healing


---

⚙️ 2. Workers

SocialAi uses parallel, isolated workers for each network and subsystem.
Each worker is lightweight, auto‑healing, and non‑blocking.

---

Farcaster Worker

Responsible for ingesting and normalizing Farcaster data.

• Poll Farcaster Hub
• Normalize casts
• Store posts
• Update profiles
• Maintain FID mappings


---

Reddit Worker

Optional, admin‑controlled.

• Poll subreddits
• Normalize posts
• Store external_posts
• Tag content for timelines


---

RPC Workers

Used for identity verification, wallet login, and future on‑chain features.

• Ethereum RPC worker
• BASE RPC worker
• Solana RPC worker


Each worker:

• Maintains RPC health
• Auto‑recovers from stale connections
• Runs independently


---

Search Worker

Responsible for search indexing and embeddings.

• Build embeddings
• Build vector index
• Rebuild on schedule
• Maintain pgvector compatibility


---

AI Worker

Powered by SmartBrain.

• Generate summaries
• Generate recommendations
• Topic clustering
• Profile optimization
• Search vector generation


---

🗄 3. Database Schema

SocialAi uses a relational database (Postgres recommended).
All tables use UUID primary keys.

Core Tables

• users
• profiles
• posts
• external_posts
• follows
• likes
• claims
• embeddings
• feature_flags
• settings


A full SQL schema is included in the repository.

---

🌐 4. API Specification

The SocialAi Node exposes a lightweight REST API.

---

Public Endpoints

Endpoint	Description	
/profiles/:handle	Public profile page data	
/posts/:id	Single post data	
/timeline/:handle	User timeline (Farcaster + optional Reddit)	
/claim/:fid	Identity claim flow	


---

Auth Endpoints

Endpoint	Description	
/auth/farcaster	Farcaster Sign‑In	
/auth/wallet	SIWE wallet login	


---

Admin Endpoints

Endpoint	Description	
/admin/flags	Feature flag management	
/admin/sync	Enable/disable workers	
/admin/health	Worker + system health	


---

🎨 5. Rendering Architecture

The public layer uses Astro for fast, SEO‑optimized rendering.

• Astro SSR for dynamic pages
• Zero‑JS by default for speed
• Islands architecture for interactive components
• Pre‑rendered sitemaps for indexing
• OpenGraph metadata for social previews


This ensures:

• Fast load times
• Perfect Google indexing
• Minimal client‑side JavaScript


---

🧠 6. SmartBrain Integration

SmartBrain enhances SocialAi with AI‑powered insights.

SmartBrain Receives

• User profile
• Timeline
• Embeddings
• Metadata


SmartBrain Outputs

• Timeline summaries
• Recommendations
• Optimized bios
• Topic clusters
• Search vectors


SmartBrain runs inside the AI Worker and is orchestrated by the one‑file SocialAi Node.

---

🔧 7. Healdec Engine

Healdec is the auto‑healing, auto‑updating engine that ensures SocialAi never becomes stale or heavy.

Healdec Performs

• Dependency scan
• Safe update
• Rebuild
• Validation
• Rollback (if needed)


Healdec Rules

• Never destructive
• Never deletes code
• Never breaks schema
• Always additive
• Always keeps Node + frameworks up to date
• Always prevents “redness” in CI/CD


Healdec is integrated directly into the one‑file orchestrator.

---

🔐 8. Security

SocialAi uses modern, decentralized identity standards.

• SIWE (Sign‑In With Ethereum)
• Farcaster Sign‑In
• ENS reverse lookup
• Rate limiting
• Abuse detection
• Worker isolation
• Non‑destructive automation


Security is enforced at:

• API layer
• Worker layer
• Identity layer
• Database layer


---

🚀 Summary

SocialAi is a modern, lightweight, auto‑healing social indexing engine built for:

• Speed
• SEO
• Identity ownership
• Parallel workers
• AI‑powered insights
• Zero heaviness
• Zero dependency rot


It combines:

• Astro + Vite
• Angular
• Node 22+
• Healdec
• SmartBrain
• Parallel chain workers
• Postgres


All orchestrated through a single, elegant, one‑file Node engine.
