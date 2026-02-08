# Testing Guide

This guide covers testing strategies, practices, and commands for SocialAi.

---

## Table of Contents

1. [Testing Philosophy](#testing-philosophy)
2. [Test Types](#test-types)
3. [Testing Tools](#testing-tools)
4. [Manual Testing](#manual-testing)
5. [API Testing](#api-testing)
6. [Frontend Testing](#frontend-testing)
7. [Worker Testing](#worker-testing)
8. [Database Testing](#database-testing)
9. [Integration Testing](#integration-testing)
10. [Performance Testing](#performance-testing)

---

## Testing Philosophy

### Core Principles

1. **Test behavior, not implementation**
2. **Write tests that provide value**
3. **Keep tests simple and readable**
4. **Test critical paths thoroughly**
5. **Balance test coverage with development speed**

### When to Write Tests

**High Priority:**
- API endpoints
- Business logic
- Data transformations
- Security-critical code
- Complex algorithms

**Lower Priority:**
- Simple getters/setters
- UI styling
- Configuration files
- Documentation

---

## Test Types

### Unit Tests
Test individual functions or components in isolation.

**Example:**
```javascript
describe('calculateEngagement', () => {
  it('should calculate engagement rate correctly', () => {
    const post = { likes: 10, recasts: 5, replies: 2 };
    const engagement = calculateEngagement(post);
    expect(engagement).toBe(17);
  });

  it('should handle posts with no engagement', () => {
    const post = { likes: 0, recasts: 0, replies: 0 };
    const engagement = calculateEngagement(post);
    expect(engagement).toBe(0);
  });
});
```

### Integration Tests
Test interactions between multiple components.

**Example:**
```javascript
describe('Post Creation Flow', () => {
  it('should create post and notify followers', async () => {
    const user = await createUser({ username: 'alice' });
    const post = await createPost({ userId: user.id, content: 'Hello' });
    const notifications = await getNotifications(user.followers);
    
    expect(post.id).toBeDefined();
    expect(notifications.length).toBeGreaterThan(0);
  });
});
```

### End-to-End Tests
Test complete user flows through the application.

**Example:**
```javascript
describe('User Claim Flow', () => {
  it('should allow user to claim profile', async () => {
    // 1. Navigate to profile page
    await page.goto('http://localhost:4321/profile/alice');
    
    // 2. Click claim button
    await page.click('#claim-profile');
    
    // 3. Sign in with Farcaster
    await page.click('#farcaster-signin');
    
    // 4. Verify profile is claimed
    const claimed = await page.$eval('#claimed-badge', el => el.textContent);
    expect(claimed).toBe('Claimed');
  });
});
```

---

## Testing Tools

### Current Setup

**Backend:**
- Manual testing via curl/API clients
- Health checks via `/health` endpoint
- Worker health monitoring

**Frontend:**
- Browser DevTools
- Manual testing
- Visual inspection

### Recommended Tools (Future)

**Unit Testing:**
- **Jest** - JavaScript testing framework
- **Mocha** + **Chai** - Alternative testing framework

**Integration Testing:**
- **Supertest** - HTTP assertions
- **Nock** - HTTP mocking

**E2E Testing:**
- **Playwright** - Browser automation
- **Cypress** - E2E testing framework

**API Testing:**
- **Postman** - API development and testing
- **Insomnia** - REST API client
- **Thunder Client** - VS Code extension

---

## Manual Testing

### Backend Health Check

```bash
# Check server health
curl http://localhost:3000/health

# Expected response:
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

### Worker Status Check

```bash
# Check worker status
curl http://localhost:3000/api/workers/status

# Expected response:
[
  {
    "name": "farcaster",
    "healthy": true,
    "enabled": true
  },
  {
    "name": "reddit",
    "healthy": true,
    "enabled": false
  }
]
```

### Database Connection Test

```bash
# Connect to database
psql -U postgres -d socialai_dev

# Run test query
SELECT COUNT(*) FROM users;

# Check database health
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## API Testing

### Testing with curl

#### GET Requests

```bash
# List users
curl http://localhost:3000/api/users

# Get specific user
curl http://localhost:3000/api/users/uuid

# Get profile
curl http://localhost:3000/api/profiles/alice

# List posts
curl http://localhost:3000/api/posts

# Get external posts
curl "http://localhost:3000/api/external-posts?source=farcaster"
```

#### POST Requests

```bash
# Create user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "farcaster_id": 1234,
    "ethereum_address": "0x1234...",
    "ens_name": "alice.eth"
  }'

# Create post
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "uuid",
    "content": "Hello world!"
  }'
```

#### PUT Requests

```bash
# Update feature flag
curl -X PUT http://localhost:3000/api/feature-flags/farcaster_sync \
  -H "Content-Type: application/json" \
  -d '{"enabled": true}'
```

### Testing with JavaScript

Create `test-api.js`:

```javascript
const BASE_URL = 'http://localhost:3000';

async function testUsers() {
  console.log('Testing Users API...');
  
  // List users
  const users = await fetch(`${BASE_URL}/api/users`)
    .then(res => res.json());
  console.log('✓ Listed users:', users.length);
  
  // Get specific user
  if (users.length > 0) {
    const user = await fetch(`${BASE_URL}/api/users/${users[0].id}`)
      .then(res => res.json());
    console.log('✓ Got user:', user.username);
  }
}

async function testPosts() {
  console.log('Testing Posts API...');
  
  // List posts
  const posts = await fetch(`${BASE_URL}/api/posts`)
    .then(res => res.json());
  console.log('✓ Listed posts:', posts.length);
  
  // Get specific post
  if (posts.length > 0) {
    const post = await fetch(`${BASE_URL}/api/posts/${posts[0].id}`)
      .then(res => res.json());
    console.log('✓ Got post:', post.content.substring(0, 50));
  }
}

async function testFeatureFlags() {
  console.log('Testing Feature Flags API...');
  
  // List feature flags
  const flags = await fetch(`${BASE_URL}/api/feature-flags`)
    .then(res => res.json());
  console.log('✓ Listed feature flags:', flags.length);
}

async function runTests() {
  try {
    await testUsers();
    await testPosts();
    await testFeatureFlags();
    console.log('\n✓ All tests passed!');
  } catch (error) {
    console.error('\n✗ Test failed:', error.message);
  }
}

runTests();
```

Run with:
```bash
node test-api.js
```

### Testing with Postman

1. Create new collection "SocialAi API"
2. Add requests for each endpoint
3. Add tests:

```javascript
// Test status code
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Test response structure
pm.test("Response has users array", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an('array');
});

// Test response data
pm.test("User has required fields", function () {
    var jsonData = pm.response.json();
    if (jsonData.length > 0) {
        pm.expect(jsonData[0]).to.have.property('id');
        pm.expect(jsonData[0]).to.have.property('username');
    }
});
```

---

## Frontend Testing

### Public App (Astro)

#### Manual Testing Checklist

**Landing Page:**
- [ ] Page loads without errors
- [ ] Hero section displays correctly
- [ ] Features section renders
- [ ] Navigation works
- [ ] Links are functional

**Profile Pages:**
- [ ] Profile loads for existing user
- [ ] 404 for non-existent user
- [ ] Avatar and banner display
- [ ] Stats show correctly
- [ ] Posts render in timeline
- [ ] Tabs switch correctly

**Timeline:**
- [ ] Posts load and display
- [ ] Infinite scroll works
- [ ] Post cards render correctly
- [ ] Media displays properly
- [ ] Timestamps format correctly

**Claim Flow:**
- [ ] Form displays correctly
- [ ] Validation works
- [ ] Error messages show
- [ ] Success state works
- [ ] Redirect after claim

#### Browser Testing

Test in multiple browsers:
- Chrome/Edge (Chromium)
- Firefox
- Safari (if on macOS)

#### Responsive Testing

Test at different viewport sizes:
- Mobile: 375px, 414px
- Tablet: 768px, 1024px
- Desktop: 1280px, 1920px

Use Chrome DevTools Device Mode (F12 → Toggle Device Toolbar).

### Admin Console (Angular)

#### Manual Testing Checklist

**Dashboard:**
- [ ] Metrics load correctly
- [ ] Charts render
- [ ] Data updates
- [ ] Navigation works

**Feature Flags:**
- [ ] Flags list loads
- [ ] Toggle switches work
- [ ] Changes persist
- [ ] Success messages show

**Sync Controls:**
- [ ] Worker cards display
- [ ] Status badges show correct state
- [ ] Start/stop buttons work
- [ ] Last sync time updates

**Worker Health:**
- [ ] Health status loads
- [ ] Worker details show
- [ ] Restart button works
- [ ] Logs display

#### Angular Testing (Future)

Create tests in `.spec.ts` files:

```typescript
describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load metrics on init', () => {
    expect(component.metrics).toBeDefined();
    expect(component.metrics.length).toBeGreaterThan(0);
  });
});
```

---

## Worker Testing

### Manual Worker Testing

1. **Start Backend:**
```bash
npm run dev
```

2. **Monitor Worker Output:**
Look for worker-specific log messages:
```
[Farcaster Worker] Starting...
[Farcaster Worker] Syncing casts...
[Farcaster Worker] Synced 150 casts
```

3. **Check Database:**
```bash
psql -U postgres -d socialai_dev

-- Check external posts table
SELECT 
  source,
  COUNT(*) as count,
  MAX(synced_at) as last_sync
FROM external_posts
GROUP BY source;
```

4. **Verify Worker Health:**
```bash
curl http://localhost:3000/api/workers/status
```

### Worker Test Cases

**Farcaster Worker:**
- [ ] Connects to Farcaster Hub
- [ ] Syncs casts successfully
- [ ] Handles API errors gracefully
- [ ] Updates sync timestamp
- [ ] Stores data in database

**Search Worker:**
- [ ] Indexes new posts
- [ ] Updates existing indexes
- [ ] Handles deletions
- [ ] Search returns results
- [ ] Relevance ranking works

**AI Worker:**
- [ ] Generates embeddings
- [ ] Creates summaries
- [ ] Provides recommendations
- [ ] Handles errors
- [ ] Processes queue efficiently

---

## Database Testing

### Schema Validation

```bash
psql -U postgres -d socialai_dev

-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Verify foreign key constraints
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY';
```

### Data Integrity Tests

```sql
-- Check for orphaned records
SELECT 'posts with invalid user_id' as issue, COUNT(*)
FROM posts p
WHERE NOT EXISTS (SELECT 1 FROM users u WHERE u.id = p.user_id);

-- Check for duplicate usernames
SELECT username, COUNT(*) as count
FROM profiles
GROUP BY username
HAVING COUNT(*) > 1;

-- Check for invalid timestamps
SELECT 'future timestamps' as issue, COUNT(*)
FROM posts
WHERE created_at > NOW();
```

### Performance Tests

```sql
-- Test query performance
EXPLAIN ANALYZE
SELECT p.*, u.username
FROM posts p
JOIN users u ON u.id = p.user_id
WHERE p.created_at > NOW() - INTERVAL '7 days'
ORDER BY p.created_at DESC
LIMIT 100;

-- Check for missing indexes
SELECT
  schemaname,
  tablename,
  attname
FROM pg_stats
WHERE schemaname = 'public'
  AND n_distinct > 100
  AND correlation < 0.1
ORDER BY tablename, attname;
```

---

## Integration Testing

### Full System Test

1. **Start all services:**
```bash
# Terminal 1: Backend
npm run dev

# Terminal 2: Public app
npm run dev:public

# Terminal 3: Admin console
npm run dev:admin
```

2. **Test complete user flow:**
   - Visit landing page
   - Browse profiles
   - View timeline
   - Access admin console
   - Toggle feature flag
   - Verify changes reflected

3. **Test worker integration:**
   - Check worker status in admin
   - Verify data syncing
   - Check database updates
   - Monitor health endpoint

### API Integration Test

Create `integration-test.js`:

```javascript
const BASE_URL = 'http://localhost:3000';

async function integrationTest() {
  console.log('Running integration test...\n');

  // 1. Health check
  console.log('1. Checking system health...');
  const health = await fetch(`${BASE_URL}/health`).then(r => r.json());
  console.log(`✓ System status: ${health.status}`);

  // 2. List users
  console.log('\n2. Listing users...');
  const users = await fetch(`${BASE_URL}/api/users`).then(r => r.json());
  console.log(`✓ Found ${users.length} users`);

  // 3. List posts
  console.log('\n3. Listing posts...');
  const posts = await fetch(`${BASE_URL}/api/posts`).then(r => r.json());
  console.log(`✓ Found ${posts.length} posts`);

  // 4. Check feature flags
  console.log('\n4. Checking feature flags...');
  const flags = await fetch(`${BASE_URL}/api/feature-flags`).then(r => r.json());
  console.log(`✓ Found ${flags.length} feature flags`);

  // 5. Check workers
  console.log('\n5. Checking workers...');
  const workers = await fetch(`${BASE_URL}/api/workers/status`).then(r => r.json());
  const healthy = workers.filter(w => w.healthy).length;
  console.log(`✓ ${healthy}/${workers.length} workers healthy`);

  console.log('\n✓ Integration test complete!');
}

integrationTest().catch(console.error);
```

---

## Performance Testing

### API Performance

Test API response times:

```bash
# Using curl
time curl http://localhost:3000/api/posts

# Using Apache Bench
ab -n 1000 -c 10 http://localhost:3000/api/posts

# Using wrk
wrk -t4 -c100 -d30s http://localhost:3000/api/posts
```

### Database Performance

```sql
-- Enable timing
\timing

-- Test query performance
SELECT * FROM posts ORDER BY created_at DESC LIMIT 100;

-- Check slow queries
SELECT 
  query,
  calls,
  total_time / 1000 as total_seconds,
  mean_time / 1000 as avg_seconds
FROM pg_stat_statements
WHERE mean_time > 1000  -- queries taking more than 1 second
ORDER BY mean_time DESC
LIMIT 10;
```

### Frontend Performance

Use Chrome DevTools Lighthouse:
1. Open page in Chrome
2. Press F12
3. Go to Lighthouse tab
4. Run audit
5. Review metrics:
   - First Contentful Paint (FCP)
   - Largest Contentful Paint (LCP)
   - Time to Interactive (TTI)
   - Cumulative Layout Shift (CLS)

---

## Best Practices

### Testing Guidelines

1. **Write tests before fixing bugs** (helps prevent regressions)
2. **Test edge cases** (null values, empty arrays, etc.)
3. **Use descriptive test names** (what, when, expected result)
4. **Keep tests independent** (no shared state)
5. **Mock external dependencies** (APIs, databases)

### Common Pitfalls

1. **Testing implementation details** instead of behavior
2. **Tests that are too slow** (add timeout limits)
3. **Flaky tests** (intermittent failures)
4. **Overlapping test coverage** (redundant tests)
5. **Insufficient error testing** (only testing happy path)

---

## Future Testing Improvements

### Automated Testing

- Set up Jest/Mocha for unit tests
- Add Playwright for E2E tests
- Implement CI/CD testing pipeline
- Add code coverage reporting

### Continuous Testing

- GitHub Actions workflow
- Run tests on every PR
- Automated deployment after tests pass
- Slack/Discord notifications for failures

### Test Coverage Goals

- Unit tests: 70%+ coverage
- Integration tests: Critical paths covered
- E2E tests: Key user flows covered

---

*Last Updated: 2026-02-07*
