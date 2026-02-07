# SocialAi API Reference

Complete API documentation for the SocialAi backend.

## Base URL

```
http://localhost:3000
```

## Authentication

Currently, most endpoints are public. Authentication via Farcaster and SIWE will be required for:
- Creating posts
- Claiming profiles
- Modifying user data

## Endpoints

### Health & Status

#### GET /health

Check system health and worker status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-28T04:00:00.000Z",
  "workers": [
    {
      "name": "farcaster",
      "healthy": true
    }
  ]
}
```

#### GET /api/workers/status

Get detailed worker status.

**Response:**
```json
[
  {
    "name": "farcaster",
    "healthy": true,
    "enabled": true
  }
]
```

---

### Users

#### GET /api/users

List all users (paginated).

**Query Parameters:**
- None (returns first 100)

**Response:**
```json
[
  {
    "id": "uuid",
    "farcaster_id": 1234,
    "ethereum_address": "0x...",
    "ens_name": "user.eth",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

#### GET /api/users/:id

Get a specific user by ID.

**Parameters:**
- `id` (string) - User UUID

**Response:**
```json
{
  "id": "uuid",
  "farcaster_id": 1234,
  "ethereum_address": "0x...",
  "ens_name": "user.eth",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `404` - User not found

---

### Profiles

#### GET /api/profiles

List all profiles (paginated).

**Query Parameters:**
- None (returns first 100)

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "username": "alice",
    "display_name": "Alice",
    "bio": "Builder",
    "avatar_url": "https://...",
    "banner_url": "https://...",
    "website_url": "https://...",
    "twitter_handle": "alice",
    "claimed": true,
    "verified": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

#### GET /api/profiles/:username

Get a specific profile by username.

**Parameters:**
- `username` (string) - Profile username

**Response:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "username": "alice",
  "display_name": "Alice",
  "bio": "Builder",
  "avatar_url": "https://...",
  "claimed": true,
  "verified": true
}
```

**Error Responses:**
- `404` - Profile not found

---

### Posts

#### GET /api/posts

List all internal posts (paginated).

**Query Parameters:**
- None (returns first 100, ordered by created_at DESC)

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "content": "Hello world!",
    "media_urls": ["https://..."],
    "parent_id": null,
    "root_id": null,
    "reply_count": 0,
    "recast_count": 0,
    "like_count": 5,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

#### GET /api/posts/:id

Get a specific post by ID.

**Parameters:**
- `id` (string) - Post UUID

**Response:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "content": "Hello world!",
  "reply_count": 0,
  "like_count": 5,
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `404` - Post not found

---

### External Posts

#### GET /api/external-posts

List external posts from Farcaster, Reddit, etc.

**Query Parameters:**
- `source` (optional) - Filter by source: `farcaster`, `reddit`

**Response:**
```json
[
  {
    "id": "uuid",
    "external_id": "farcaster_12345",
    "source": "farcaster",
    "author_id": "1234",
    "author_name": "alice",
    "content": "Cast content",
    "url": "https://...",
    "metadata": { "fid": 1234 },
    "created_at": "2024-01-01T00:00:00.000Z",
    "synced_at": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### Timeline

#### GET /api/timeline/:username

Get a user's timeline (posts from followed users).

**Parameters:**
- `username` (string) - Profile username

**Response:**
```json
[
  {
    "id": "uuid",
    "content": "Post content",
    "username": "bob",
    "display_name": "Bob",
    "avatar_url": "https://...",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### Feature Flags

#### GET /api/feature-flags

List all feature flags.

**Response:**
```json
[
  {
    "id": "uuid",
    "flag_name": "farcaster_sync",
    "enabled": true,
    "description": "Enable Farcaster data synchronization",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

#### PUT /api/feature-flags/:name

Update a feature flag.

**Parameters:**
- `name` (string) - Flag name

**Request Body:**
```json
{
  "enabled": true
}
```

**Response:**
```json
{
  "id": "uuid",
  "flag_name": "farcaster_sync",
  "enabled": true,
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `404` - Feature flag not found

---

### Settings

#### GET /api/settings

List all system settings.

**Response:**
```json
[
  {
    "id": "uuid",
    "key": "sync_interval",
    "value": { "minutes": 5 },
    "description": "Interval for worker synchronization",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### AI Features

#### GET /api/ai/summary/:postId

Generate an AI summary of a post.

**Parameters:**
- `postId` (string) - Post UUID

**Response:**
```json
{
  "summary": "This post discusses...",
  "topics": ["web3", "social"],
  "sentiment": "neutral"
}
```

**Error Responses:**
- `404` - Post not found

#### GET /api/ai/recommendations/:userId

Get AI-powered recommendations for a user.

**Parameters:**
- `userId` (string) - User UUID

**Response:**
```json
[
  {
    "id": "uuid",
    "username": "recommended_user",
    "display_name": "Recommended User",
    "bio": "..."
  }
]
```

---

## Error Handling

All endpoints return standard HTTP status codes:

- `200` - Success
- `400` - Bad Request
- `404` - Not Found
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

Error response format:
```json
{
  "error": "Error message"
}
```

## Rate Limiting

API requests are rate limited to:
- **100 requests per minute** per IP address

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Pagination

Currently, endpoints return a fixed number of results:
- Most list endpoints: 100 items
- Timeline: 100 items
- Posts: 100 items

Future versions will include proper pagination with `limit` and `offset` or cursor-based pagination.

## CORS

CORS is enabled for all origins in development. In production, configure allowed origins via environment variables.

## WebSocket Support

WebSocket support for real-time updates is planned for future releases.

---

## Related Documentation

For more information, see:

- **[Installation Guide](INSTALLATION.md)** - Setup instructions and environment configuration
- **[Architecture Overview](ARCHITECTURE.md)** - System architecture and components
- **[Development Guide](DEVELOPMENT.md)** - API development workflow and testing
- **[Testing Guide](TESTING.md)** - API testing strategies and examples
- **[Troubleshooting](TROUBLESHOOTING.md)** - Common API issues and solutions
- **[Deployment Guide](DEPLOYMENT.md)** - Production deployment and configuration

---

*Last Updated: 2026-02-07*
