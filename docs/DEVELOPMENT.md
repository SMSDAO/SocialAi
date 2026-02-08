# Development Guide

This guide covers the development workflow, best practices, and tools for working on SocialAi.

---

## Table of Contents

1. [Development Environment Setup](#development-environment-setup)
2. [Project Structure](#project-structure)
3. [Development Workflow](#development-workflow)
4. [Working with Components](#working-with-components)
5. [Database Development](#database-development)
6. [API Development](#api-development)
7. [Worker Development](#worker-development)
8. [Frontend Development](#frontend-development)
9. [Debugging](#debugging)
10. [Common Tasks](#common-tasks)

---

## Development Environment Setup

### 1. Install Prerequisites

**Required:**
- Node.js 18+ ([download](https://nodejs.org/))
- PostgreSQL 14+ ([download](https://www.postgresql.org/download/))
- Git ([download](https://git-scm.com/downloads))

**Optional but Recommended:**
- VS Code with extensions:
  - ESLint
  - Prettier
  - PostgreSQL
  - Astro
  - Angular Language Service
- PostgreSQL GUI (pgAdmin, DBeaver, or Postico)
- API testing tool (Postman, Insomnia, or Thunder Client)

### 2. Clone and Setup

```bash
# Clone repository
git clone https://github.com/SMSDAO/SocialAi.git
cd SocialAi

# Install all dependencies (monorepo)
npm install

# Setup database
createdb socialai_dev
psql -U postgres -d socialai_dev -f db/schema.sql

# Configure environment
cp .env.example .env
# Edit .env with your local settings
```

### 3. Environment Configuration

Edit `.env`:

```bash
# Development Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/socialai_dev

# Server Configuration
PORT=3000
NODE_ENV=development

# Feature Flags (all enabled for development)
FARCASTER_SYNC_ENABLED=true
REDDIT_SYNC_ENABLED=true
AI_SUMMARIES_ENABLED=true
AI_RECOMMENDATIONS_ENABLED=true

# External Services (optional for development)
FARCASTER_HUB_URL=https://hub.farcaster.xyz
OPENAI_API_KEY=sk-your-key-here

# Security (use random string for development)
JWT_SECRET=dev-secret-change-in-production
CORS_ORIGIN=http://localhost:4321
```

### 4. Verify Setup

```bash
# Terminal 1: Start backend + workers
npm run dev

# Terminal 2: Start public app
npm run dev:public

# Terminal 3: Start admin console
npm run dev:admin
```

**Expected Output:**
- Backend: `✓ Server running on http://localhost:3000`
- Public: `✓ Astro dev server running on http://localhost:4321`
- Admin: `✓ Angular dev server running on http://localhost:4200`

**Test Health:**
- Backend: http://localhost:3000/health
- Public: http://localhost:4321
- Admin: http://localhost:4200

---

## Project Structure

```
SocialAi/
├── apps/
│   ├── public/              # Public-facing Astro app
│   │   ├── src/
│   │   │   ├── pages/       # Astro pages (routes)
│   │   │   ├── components/  # Reusable components
│   │   │   ├── layouts/     # Page layouts
│   │   │   └── styles/      # CSS styles
│   │   ├── public/          # Static assets
│   │   └── astro.config.mjs # Astro configuration
│   │
│   └── admin/               # Admin Angular app
│       ├── src/
│       │   ├── app/         # Angular application
│       │   │   ├── components/  # UI components
│       │   │   ├── services/    # Business logic
│       │   │   └── models/      # TypeScript models
│       │   └── assets/      # Static assets
│       └── angular.json     # Angular configuration
│
├── node/                    # Backend orchestrator
│   ├── socialai.node.js     # One-file node server
│   └── package.json
│
├── workers/                 # Parallel workers
│   ├── farcaster.worker.js  # Farcaster sync
│   ├── reddit.worker.js     # Reddit sync
│   ├── ethereum.worker.js   # Ethereum RPC
│   ├── base.worker.js       # BASE RPC
│   ├── solana.worker.js     # Solana RPC
│   ├── search.worker.js     # Search indexing
│   ├── ai.worker.js         # AI processing
│   └── package.json
│
├── db/                      # Database
│   └── schema.sql           # Database schema
│
├── docs/                    # Documentation
│   ├── README.md            # Documentation index
│   ├── INSTALLATION.md
│   ├── ARCHITECTURE.md
│   └── ...
│
├── package.json             # Root monorepo config
├── .env.example             # Environment template
├── .gitignore              # Git ignore rules
└── README.md               # Project README
```

---

## Development Workflow

### Daily Development Cycle

1. **Pull Latest Changes**
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature
   ```

3. **Start Development Servers**
   ```bash
   # Terminal 1: Backend
   npm run dev
   
   # Terminal 2: Public app
   npm run dev:public
   
   # Terminal 3: Admin console
   npm run dev:admin
   ```

4. **Make Changes**
   - Edit code
   - Test changes
   - Verify in browser

5. **Commit and Push**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push origin feature/your-feature
   ```

6. **Create Pull Request**
   - Open PR on GitHub
   - Request review
   - Address feedback

### Hot Reload

All development servers support hot reload:
- **Backend**: Restart manually (fast ~1s)
- **Public App**: Hot Module Replacement (HMR)
- **Admin Console**: Live reload with HMR

---

## Working with Components

### Backend (Node.js)

#### Adding a New API Endpoint

1. Open `node/socialai.node.js`
2. Add route handler:

```javascript
// GET endpoint example
app.get('/api/your-endpoint', async (req, res) => {
  try {
    // Query database
    const result = await db.query('SELECT * FROM your_table');
    res.json(result.rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST endpoint example
app.post('/api/your-endpoint', async (req, res) => {
  try {
    const { field1, field2 } = req.body;
    
    // Validate input
    if (!field1 || !field2) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Insert into database
    const result = await db.query(
      'INSERT INTO your_table (field1, field2) VALUES ($1, $2) RETURNING *',
      [field1, field2]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});
```

3. Test with curl or API client:
```bash
curl http://localhost:3000/api/your-endpoint
```

### Public App (Astro)

#### Adding a New Page

1. Create file in `apps/public/src/pages/`:

```astro
---
// your-page.astro
import Layout from '../layouts/Layout.astro';

// Server-side code (runs at build time)
const data = await fetch('http://localhost:3000/api/your-endpoint')
  .then(res => res.json());
---

<Layout title="Your Page Title">
  <h1>Your Page</h1>
  <ul>
    {data.map(item => (
      <li>{item.name}</li>
    ))}
  </ul>
</Layout>
```

2. Access at: http://localhost:4321/your-page

#### Creating a Component

1. Create file in `apps/public/src/components/`:

```astro
---
// YourComponent.astro
export interface Props {
  title: string;
  items: Array<{ id: string; name: string; }>;
}

const { title, items } = Astro.props;
---

<div class="your-component">
  <h2>{title}</h2>
  <ul>
    {items.map(item => (
      <li key={item.id}>{item.name}</li>
    ))}
  </ul>
</div>

<style>
  .your-component {
    padding: 1rem;
    border: 1px solid #ccc;
  }
</style>
```

2. Use in pages:
```astro
---
import YourComponent from '../components/YourComponent.astro';

const items = [...];
---

<YourComponent title="My Items" items={items} />
```

### Admin Console (Angular)

#### Adding a New Component

1. Generate component:
```bash
cd apps/admin
ng generate component components/your-component
```

2. Implement component:

```typescript
// your-component.component.ts
import { Component, OnInit } from '@angular/core';
import { YourService } from '../../services/your.service';

@Component({
  selector: 'app-your-component',
  templateUrl: './your-component.component.html',
  styleUrls: ['./your-component.component.css']
})
export class YourComponentComponent implements OnInit {
  data: any[] = [];
  loading = false;

  constructor(private yourService: YourService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.yourService.getData().subscribe({
      next: (data) => {
        this.data = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.loading = false;
      }
    });
  }
}
```

```html
<!-- your-component.component.html -->
<div class="your-component">
  <h2>Your Component</h2>
  
  <div *ngIf="loading">Loading...</div>
  
  <ul *ngIf="!loading">
    <li *ngFor="let item of data">{{ item.name }}</li>
  </ul>
</div>
```

#### Adding a Service

1. Generate service:
```bash
cd apps/admin
ng generate service services/your-service
```

2. Implement service:

```typescript
// your-service.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class YourServiceService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/your-endpoint`);
  }

  createItem(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/your-endpoint`, data);
  }
}
```

---

## Database Development

### Running Queries

```bash
# Connect to database
psql -U postgres -d socialai_dev

# List tables
\dt

# Describe table
\d users

# Run query
SELECT * FROM users LIMIT 10;

# Exit
\q
```

### Making Schema Changes

1. Edit `db/schema.sql`
2. Drop and recreate database:
```bash
dropdb socialai_dev
createdb socialai_dev
psql -U postgres -d socialai_dev -f db/schema.sql
```

3. Or use migrations (recommended for production):
```sql
-- migrations/001_add_column.sql
ALTER TABLE users ADD COLUMN new_field VARCHAR(255);
```

### Seeding Test Data

```bash
psql -U postgres -d socialai_dev

INSERT INTO users (id, farcaster_id, ethereum_address, created_at, updated_at)
VALUES 
  (gen_random_uuid(), 1234, '0x1234...', NOW(), NOW()),
  (gen_random_uuid(), 5678, '0x5678...', NOW(), NOW());

INSERT INTO profiles (id, user_id, username, display_name, bio, created_at, updated_at)
VALUES
  (gen_random_uuid(), (SELECT id FROM users LIMIT 1), 'alice', 'Alice', 'Builder', NOW(), NOW());
```

---

## API Development

### Testing API Endpoints

#### Using curl

```bash
# GET request
curl http://localhost:3000/api/users

# POST request
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"user_id": "uuid", "content": "Hello world"}'

# PUT request
curl -X PUT http://localhost:3000/api/feature-flags/farcaster_sync \
  -H "Content-Type: application/json" \
  -d '{"enabled": true}'
```

#### Using JavaScript/Node

```javascript
// test-api.js
async function testAPI() {
  // GET request
  const users = await fetch('http://localhost:3000/api/users')
    .then(res => res.json());
  console.log('Users:', users);

  // POST request
  const post = await fetch('http://localhost:3000/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: 'uuid',
      content: 'Hello world'
    })
  }).then(res => res.json());
  console.log('Created post:', post);
}

testAPI();
```

### API Best Practices

1. **Always validate input**
2. **Use parameterized queries**
3. **Handle errors gracefully**
4. **Return appropriate status codes**
5. **Include error messages**
6. **Log requests and errors**

---

## Worker Development

### Creating a New Worker

1. Create file in `workers/`:

```javascript
// your-worker.js
console.log('[Your Worker] Starting...');

async function syncData() {
  try {
    console.log('[Your Worker] Syncing data...');
    
    // Your sync logic here
    // e.g., fetch from external API, process, store in database
    
    console.log('[Your Worker] Sync complete');
  } catch (error) {
    console.error('[Your Worker] Error:', error);
  }
}

// Run sync every 5 minutes
setInterval(syncData, 5 * 60 * 1000);

// Run immediately
syncData();

// Health check
process.send?.({ type: 'health', status: 'healthy' });
```

2. Register in `node/socialai.node.js`:

```javascript
const workers = {
  your: { 
    enabled: true, 
    path: '../workers/your-worker.js' 
  }
};
```

### Testing Workers

```bash
# Start backend (starts all workers)
npm run dev

# Monitor worker output in terminal
# Look for "[Your Worker]" prefixed logs
```

---

## Frontend Development

### Astro Development

**Key Concepts:**
- `.astro` files are components
- Server-side code in frontmatter `---`
- Client-side code in `<script>` tags
- Zero JavaScript by default

**Example:**
```astro
---
// Server-side (runs at build time)
const data = await fetchData();
---

<div>
  <!-- Static HTML -->
  <h1>{data.title}</h1>
  
  <!-- Client-side interactivity -->
  <button id="myButton">Click me</button>
</div>

<script>
  // Runs in browser
  document.getElementById('myButton').addEventListener('click', () => {
    alert('Clicked!');
  });
</script>
```

### Angular Development

**Key Concepts:**
- Component-based architecture
- TypeScript for type safety
- RxJS for reactive programming
- Services for business logic

**Example:**
```typescript
// Component
@Component({
  selector: 'app-example',
  template: `
    <div>
      <h1>{{ title }}</h1>
      <button (click)="handleClick()">Click me</button>
    </div>
  `
})
export class ExampleComponent {
  title = 'Example';

  handleClick() {
    console.log('Clicked!');
  }
}
```

---

## Debugging

### Backend Debugging

1. **Console Logging:**
```javascript
console.log('[DEBUG] User:', user);
console.error('[ERROR] Failed:', error);
```

2. **Node.js Debugger:**
```bash
node --inspect node/socialai.node.js
# Open chrome://inspect in Chrome
```

3. **VS Code Debugging:**
Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "program": "${workspaceFolder}/node/socialai.node.js"
    }
  ]
}
```

### Frontend Debugging

1. **Browser DevTools:**
   - Press F12
   - Check Console, Network, Sources tabs

2. **Astro Debugging:**
   - Server errors show in terminal
   - Client errors show in browser console

3. **Angular Debugging:**
   - Use Angular DevTools extension
   - Check browser console for errors
   - Use `ng serve` for detailed error messages

### Database Debugging

```sql
-- Check table contents
SELECT * FROM users;

-- Check recent inserts
SELECT * FROM posts ORDER BY created_at DESC LIMIT 10;

-- Check for duplicates
SELECT username, COUNT(*) FROM profiles GROUP BY username HAVING COUNT(*) > 1;

-- Performance analysis
EXPLAIN ANALYZE SELECT * FROM posts WHERE user_id = 'uuid';
```

---

## Common Tasks

### Resetting Database

```bash
dropdb socialai_dev
createdb socialai_dev
psql -U postgres -d socialai_dev -f db/schema.sql
```

### Clearing Node Modules

```bash
# Root
rm -rf node_modules package-lock.json
npm install

# Apps
rm -rf apps/*/node_modules apps/*/package-lock.json
cd apps/public && npm install
cd apps/admin && npm install

# Node
rm -rf node/node_modules node/package-lock.json
cd node && npm install

# Workers
rm -rf workers/node_modules workers/package-lock.json
cd workers && npm install
```

### Building for Production

```bash
# Build all
npm run build

# Build individually
npm run build:public
npm run build:admin
```

### Running Production Build

```bash
# Backend
cd node
NODE_ENV=production node socialai.node.js

# Public app (SSR)
cd apps/public
node dist/server/entry.mjs

# Admin app (static)
cd apps/admin
# Serve dist/ with any static file server
npx serve dist
```

---

## Tips and Tricks

### Faster Development

1. **Use nodemon for auto-restart:**
```bash
npm install -g nodemon
nodemon node/socialai.node.js
```

2. **Keep DevTools open** for instant debugging

3. **Use keyboard shortcuts:**
   - Cmd/Ctrl + S: Save and trigger hot reload
   - Cmd/Ctrl + K: Clear terminal
   - Cmd/Ctrl + C: Stop server

### Code Organization

1. **Keep files small** (< 300 lines)
2. **Extract reusable logic** into functions/services
3. **Use meaningful names** for variables and functions
4. **Comment complex logic** but avoid obvious comments

### Performance Tips

1. **Minimize database queries** in loops
2. **Use indexes** for frequently queried columns
3. **Cache external API calls** when possible
4. **Optimize images** before uploading
5. **Use pagination** for large datasets

---

## Getting Help

- **Documentation**: See [README.md](README.md)
- **Issues**: https://github.com/SMSDAO/SocialAi/issues
- **Discussions**: https://github.com/SMSDAO/SocialAi/discussions

---

*Last Updated: 2026-02-07*
