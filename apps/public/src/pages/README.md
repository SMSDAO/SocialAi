# SocialAi Public App - Pages Documentation

This directory contains the Astro pages for the SocialAi public-facing application.

## Pages Overview

### 1. **index.astro** - Home Page
- SEO-optimized landing page with hero section
- Features grid showcasing 4 key features:
  - 🔍 SEO-Optimized Profiles
  - 🪪 Identity Claim System
  - 🌐 Multi-Network Sync
  - 🤖 AI-Powered Insights
- Platform statistics section (profiles, posts, claims, networks)
- Fetches stats from `/api/stats` endpoint

### 2. **profiles.astro** - Profile Listing
- Browse all public profiles with search functionality
- Grid layout with profile cards showing:
  - Avatar/initial
  - Display name and username
  - Bio (truncated)
  - Stats (followers, following, posts)
- Client-side search filtering
- Fetches from `/api/profiles?limit=50`

### 3. **profile/[username].astro** - Dynamic Profile Page
- Individual profile detail page
- Profile header with:
  - Large avatar
  - Display name and username
  - Bio and metadata (location, website, Farcaster badge)
  - Stats (followers, following, posts)
- Timeline of user's posts (up to 20)
- Each post shows content, timestamp, and engagement metrics
- Fetches from:
  - `/api/profile/{username}` - Profile data
  - `/api/profile/{username}/posts?limit=20` - User posts
- 404 error handling for non-existent profiles

### 4. **timeline.astro** - Global Timeline Feed
- Aggregated feed of all posts across the network
- Filter tabs for:
  - All Posts
  - Farcaster
  - Reddit
- Post cards with:
  - Author info and avatar
  - Post content
  - Source badge (Farcaster/Reddit/SocialAi)
  - Engagement metrics
  - Timestamp
- "Load More" button for pagination
- Fetches from `/api/timeline?limit=50`

### 5. **claim.astro** - Identity Claim Flow
- Profile claiming interface with two verification methods:
  - 🟣 Farcaster Sign-In
  - 👛 Wallet Verification (SIWE)
- Step-by-step claim process explanation
- Form validation and API integration
- Shows benefits of claiming (unlockable features)
- Posts to:
  - `/api/auth/farcaster` - Farcaster verification
  - `/api/auth/siwe` - Wallet verification
- Success/error handling with alerts

## API Integration

All pages use the `API_URL` from environment variables:
```javascript
const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3000';
```

### Required API Endpoints

The pages expect these endpoints to be available:

- `GET /api/stats` - Platform statistics
- `GET /api/profiles?limit={n}` - List profiles
- `GET /api/profile/{username}` - Get profile details
- `GET /api/profile/{username}/posts?limit={n}` - Get user posts
- `GET /api/timeline?limit={n}` - Get timeline feed
- `POST /api/auth/farcaster` - Farcaster authentication
- `POST /api/auth/siwe` - Wallet authentication

## Styling

All pages use:
- Inline CSS for zero external dependencies
- Consistent color scheme (primary: #667eea purple gradient)
- Responsive grid layouts
- Smooth transitions and hover effects
- Mobile-friendly design

## SEO Features

- Semantic HTML structure
- Meta tags for title, description, OG tags
- Twitter card support
- Fast page loads (SSR)
- Zero JavaScript by default (progressive enhancement)

## Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Create a `.env` file:
```
PUBLIC_API_URL=http://localhost:3000
```

## Dependencies

- `astro`: ^4.0.0
- `@astrojs/node`: ^8.0.0 (SSR adapter)
- `typescript`: ^5.3.3
