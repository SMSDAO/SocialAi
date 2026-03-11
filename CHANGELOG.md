# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Web3 wallet integration via RainbowKit, Wagmi and Viem in `apps/public`
- Vercel deployment configuration (`vercel.json`) for `apps/public` (Astro SSR) and `apps/admin` (Angular)
- GitHub Actions workflow for automated Vercel deployment on push to `main`
- `bootstrap.ps1` PowerShell script for one-command local development setup

## [0.1.0] - 2026-03-11

### Added

- Monorepo structure with `apps/public` (Astro SSR frontend), `apps/admin` (Angular dashboard), `node` (API server) and `workers` directories
- `apps/public` Astro 5 frontend with identity claim, profile and timeline pages
- `apps/admin` Angular 19 admin dashboard isolated from the public frontend
- Node.js API server (`node/socialai.node.js`) with REST endpoints
- Background workers for AI, Ethereum, Farcaster, Reddit, Solana and search indexing
- Solidity smart contracts in `contracts/` (core, interfaces, libraries, storage, verifiers)
- PostgreSQL database schema (`db/schema.sql`)
- CI workflow (`.github/workflows/ci.yml`) running lint, typecheck and build on every PR
- `ARCHITECTURE.md`, `IMPLEMENTATION.md` and `SECURITY.md` project documentation
- `docs/` directory with API, deployment, development, installation, testing and troubleshooting guides
- MIT licence

[Unreleased]: https://github.com/SMSDAO/SocialAi/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/SMSDAO/SocialAi/releases/tag/v0.1.0
