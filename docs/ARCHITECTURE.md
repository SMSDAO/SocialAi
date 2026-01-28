# SocialAi Architecture

The SocialAi system is a lightweight, AI‑powered social discovery and identity claim network built on a **parallel, auto‑healing, one‑file node architecture** powered by Healdec and SmartBrain.

This document is the canonical architecture reference for the repository. It describes:

- High‑level system topology
- Core components and their responsibilities
- Data model and flows
- Worker orchestration
- Security and operational concerns

---

## 1. High‑level system overview

```mermaid
flowchart TD
  subgraph PublicLayer["Public Layer (Astro + Vite)"]
    P1[SEO Pages]
    P2[Profiles]
    P3[Timelines]
    P4[Claim Flow]
    P5[Landing Pages]
  end

  subgraph AdminLayer["Admin Layer (Angular)"]
    A1[Feature Flags]
    A2[Sync Controls]
    A3[Worker Health]
    A4[System Dashboard]
    A5[Abuse Controls]
  end

  subgraph Backend["One‑File SocialAi Node"]
    B1[Healdec Engine]
    B2[Worker Manager]
    B3[API Gateway]
    B4[SSR Renderer]
    B5[SmartBrain Integration]
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
