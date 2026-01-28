# SocialAi Architecture

This document provides a visual representation of the SocialAi application architecture, showing the key components and their relationships.

## System Architecture Flowchart

```mermaid
flowchart TD

    subgraph PublicLayer["Public Layer (Astro + Vite)"]
        A1[SEO Pages]
        A2[Profiles]
        A3[Timelines]
        A4[Claim Flow]
    end

    subgraph AdminLayer["Admin Layer (Angular)"]
        B1[Feature Flags]
        B2[Sync Controls]
        B3[Worker Health]
        B4[System Dashboard]
    end

    subgraph Backend["One‑File SocialAi Node"]
        C1[Healdec Engine]
        C2[Worker Orchestrator]
        C3[API Gateway]
        C4[SmartBrain Integration]
    end

    subgraph Workers["Parallel Workers"]
        W1[Farcaster Worker]
        W2[Reddit Worker]
        W3[Ethereum RPC]
        W4[BASE RPC]
        W5[Solana RPC]
        W6[Search Worker]
        W7[AI Worker]
    end

    subgraph Database["Database (Postgres)"]
        D1[Users]
        D2[Profiles]
        D3[Posts]
        D4[External Posts]
        D5[Follows]
        D6[Likes]
        D7[Claims]
        D8[Embeddings]
        D9[Feature Flags]
        D10[Settings]
    end

    PublicLayer --> Backend
    AdminLayer --> Backend
    Backend --> Workers
    Workers --> Database
```

## Component Descriptions

### Public Layer (Astro + Vite)
The public-facing layer of SocialAi, built with Astro and Vite for optimal performance and SEO:
- **SEO Pages**: Search engine optimized landing pages
- **Profiles**: User profile pages
- **Timelines**: Social activity feeds
- **Claim Flow**: Identity verification and claiming process

### Admin Layer (Angular)
Administrative interface for system management and monitoring:
- **Feature Flags**: Toggle features on/off
- **Sync Controls**: Manage data synchronization
- **Worker Health**: Monitor worker status
- **System Dashboard**: Overall system metrics

### Backend (One‑File SocialAi Node)
Core backend service powered by Healdec:
- **Healdec Engine**: Auto-healing orchestration engine
- **Worker Orchestrator**: Manages parallel workers
- **API Gateway**: Request routing and handling
- **SmartBrain Integration**: AI-powered features integration

### Parallel Workers
Independent worker processes for various data sources and operations:
- **Farcaster Worker**: Syncs Farcaster Hub data
- **Reddit Worker**: Syncs Reddit content
- **Ethereum RPC**: Ethereum blockchain interactions
- **BASE RPC**: BASE blockchain interactions
- **Solana RPC**: Solana blockchain interactions
- **Search Worker**: Search indexing and queries
- **AI Worker**: AI processing tasks

### Database (Postgres)
PostgreSQL database storing all application data:
- **Users**: User accounts
- **Profiles**: User profile information
- **Posts**: Internal posts
- **External Posts**: Posts from external sources
- **Follows**: Social graph connections
- **Likes**: User interactions
- **Claims**: Identity claims
- **Embeddings**: AI vector embeddings
- **Feature Flags**: Feature toggle states
- **Settings**: System configuration

## Data Flow

1. **Public requests** flow from the Public Layer to the Backend
2. **Admin requests** flow from the Admin Layer to the Backend
3. The **Backend** orchestrates Workers to perform operations
4. **Workers** interact with the Database for data persistence and retrieval
