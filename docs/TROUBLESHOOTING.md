# Troubleshooting Guide

This guide helps diagnose and resolve common issues with SocialAi.

---

## Table of Contents

1. [Quick Diagnostics](#quick-diagnostics)
2. [Installation Issues](#installation-issues)
3. [Database Issues](#database-issues)
4. [Backend Issues](#backend-issues)
5. [Worker Issues](#worker-issues)
6. [Frontend Issues](#frontend-issues)
7. [Performance Issues](#performance-issues)
8. [Security Issues](#security-issues)

---

## Quick Diagnostics

### System Health Check

Run this comprehensive health check:

```bash
# Check Node.js version
node --version  # Should be 18.x or higher

# Check PostgreSQL
psql --version  # Should be 14.x or higher
pg_isready      # Should say "accepting connections"

# Check if services are running
lsof -i :3000   # Backend
lsof -i :4321   # Public app
lsof -i :4200   # Admin console

# Check database connection
psql -U postgres -d socialai -c "SELECT COUNT(*) FROM users;"

# Check API health
curl http://localhost:3000/health
```

### Common Quick Fixes

1. **Restart everything:**
```bash
# Stop all processes (Ctrl+C in each terminal)
# Then restart
npm run dev
npm run dev:public
npm run dev:admin
```

2. **Clear caches and reinstall:**
```bash
rm -rf node_modules package-lock.json
rm -rf apps/*/node_modules apps/*/package-lock.json
npm install
```

3. **Reset database:**
```bash
dropdb socialai
createdb socialai
psql -U postgres -d socialai -f db/schema.sql
```

---

## Installation Issues

### Issue: `npm install` fails

**Symptoms:**
```
npm ERR! code ENOENT
npm ERR! syscall open
npm ERR! path package.json
```

**Solutions:**

1. Verify you're in the correct directory:
```bash
cd /path/to/SocialAi
ls package.json  # Should exist
```

2. Check Node.js version:
```bash
node --version  # Must be 18.x or higher
```

3. Clear npm cache:
```bash
npm cache clean --force
npm install
```

4. Try with legacy peer deps:
```bash
npm install --legacy-peer-deps
```

### Issue: PostgreSQL not installed

**Symptoms:**
```
createdb: command not found
psql: command not found
```

**Solutions:**

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install postgresql-14
sudo systemctl start postgresql
```

**Windows:**
- Download installer from https://www.postgresql.org/download/windows/
- Run installer and follow prompts

### Issue: Port already in use

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions:**

1. Find and kill process using port:
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <process_id> /F
```

2. Change port in `.env`:
```bash
PORT=3001
```

3. Restart the application.

---

## Database Issues

### Issue: Cannot connect to database

**Symptoms:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solutions:**

1. Check if PostgreSQL is running:
```bash
pg_isready
# If not: brew services start postgresql@14  # macOS
# If not: sudo systemctl start postgresql    # Linux
```

2. Verify connection string in `.env`:
```bash
DATABASE_URL=postgresql://postgres:password@localhost:5432/socialai
```

3. Check PostgreSQL logs:
```bash
# macOS
tail -f /usr/local/var/log/postgresql@14.log

# Linux
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

4. Test connection manually:
```bash
psql -U postgres -d socialai
# If this fails, your credentials or database name might be wrong
```

### Issue: Database doesn't exist

**Symptoms:**
```
ERROR: database "socialai" does not exist
```

**Solutions:**

```bash
# Create database
createdb socialai

# Or using psql
psql -U postgres
CREATE DATABASE socialai;
\q

# Run schema
psql -U postgres -d socialai -f db/schema.sql
```

### Issue: Permission denied

**Symptoms:**
```
ERROR: permission denied for table users
```

**Solutions:**

1. Grant permissions:
```sql
psql -U postgres -d socialai

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_user;
```

2. Or recreate database as correct user:
```bash
dropdb socialai
createdb -O your_user socialai
psql -U your_user -d socialai -f db/schema.sql
```

### Issue: Tables don't exist

**Symptoms:**
```
ERROR: relation "users" does not exist
```

**Solutions:**

```bash
# Run schema
psql -U postgres -d socialai -f db/schema.sql

# Verify tables exist
psql -U postgres -d socialai -c "\dt"
```

### Issue: Slow queries

**Symptoms:**
- API responses taking > 1 second
- Database CPU usage high

**Solutions:**

1. Check for missing indexes:
```sql
-- Add index on frequently queried columns
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_external_posts_source ON external_posts(source);
```

2. Analyze slow queries:
```sql
-- Enable query logging
ALTER SYSTEM SET log_min_duration_statement = 1000;  -- Log queries > 1s
SELECT pg_reload_conf();

-- View slow queries
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

3. Run VACUUM:
```sql
VACUUM ANALYZE;
```

---

## Backend Issues

### Issue: Server won't start

**Symptoms:**
```
Error: Cannot find module 'express'
```

**Solutions:**

1. Install dependencies:
```bash
cd node
npm install
```

2. Check for syntax errors:
```bash
node --check socialai.node.js
```

3. Check environment variables:
```bash
cat .env
# Ensure DATABASE_URL and other required vars are set
```

### Issue: API returns 500 errors

**Symptoms:**
```
{"error": "Internal server error"}
```

**Solutions:**

1. Check server logs:
```bash
npm run dev
# Look for error stack traces in output
```

2. Test database connection:
```bash
psql -U postgres -d socialai -c "SELECT 1;"
```

3. Check for missing environment variables:
```bash
echo $DATABASE_URL
# Should print connection string
```

4. Enable detailed error logging:
```javascript
// In socialai.node.js
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);  // Add this
  res.status(500).json({ error: err.message });
});
```

### Issue: CORS errors

**Symptoms:**
```
Access to fetch at 'http://localhost:3000/api/users' from origin 
'http://localhost:4321' has been blocked by CORS policy
```

**Solutions:**

1. Check CORS configuration in `socialai.node.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:4321',  // Must match frontend URL
  credentials: true
}));
```

2. Update `.env`:
```bash
CORS_ORIGIN=http://localhost:4321
```

3. Restart backend after changes.

### Issue: Rate limiting too aggressive

**Symptoms:**
```
429 Too Many Requests
```

**Solutions:**

1. Increase rate limit in database:
```sql
UPDATE settings 
SET value = '{"requests_per_minute": 1000}'
WHERE key = 'rate_limit';
```

2. Or disable rate limiting temporarily:
```javascript
// Comment out in socialai.node.js
// app.use(rateLimiter);
```

---

## Worker Issues

### Issue: Workers not starting

**Symptoms:**
```
[Worker Manager] No workers started
```

**Solutions:**

1. Check worker configuration in `socialai.node.js`:
```javascript
const workers = {
  farcaster: { enabled: true, path: '../workers/farcaster.worker.js' },
  // ... other workers
};
```

2. Verify worker files exist:
```bash
ls -la workers/*.worker.js
```

3. Check worker syntax:
```bash
node --check workers/farcaster.worker.js
```

### Issue: Worker keeps crashing

**Symptoms:**
```
[Farcaster Worker] Error: ...
[Worker Manager] Restarting farcaster worker (attempt 1/3)
[Worker Manager] Max restart attempts reached for farcaster
```

**Solutions:**

1. Check worker logs for errors:
```bash
npm run dev | grep "Farcaster Worker"
```

2. Test worker independently:
```bash
node workers/farcaster.worker.js
```

3. Check external service connectivity:
```bash
# For Farcaster worker
curl https://hub.farcaster.xyz
```

4. Add error handling:
```javascript
// In worker file
try {
  // Sync logic
} catch (error) {
  console.error('[Worker] Error:', error);
  // Don't crash, just log
}
```

### Issue: Worker not syncing data

**Symptoms:**
- Worker shows as healthy
- But database not updating

**Solutions:**

1. Check database permissions:
```sql
-- As postgres user
GRANT ALL ON TABLE external_posts TO your_user;
```

2. Verify API keys:
```bash
echo $FARCASTER_HUB_URL
echo $REDDIT_API_KEY
# Make sure they're set
```

3. Check sync interval:
```javascript
// In worker file
setInterval(syncData, 5 * 60 * 1000);  // Every 5 minutes
```

4. Manually trigger sync:
```javascript
// Add to worker
syncData();  // Run immediately on start
```

---

## Frontend Issues

### Issue: Public app won't start

**Symptoms:**
```
[ERROR] Cannot find package 'astro'
```

**Solutions:**

1. Install dependencies:
```bash
cd apps/public
npm install
```

2. Check Node.js version:
```bash
node --version  # Must be 18+
```

3. Clear Astro cache:
```bash
rm -rf .astro
rm -rf dist
npm run dev
```

### Issue: Admin console won't start

**Symptoms:**
```
Cannot find module '@angular/core'
```

**Solutions:**

1. Install dependencies:
```bash
cd apps/admin
npm install
```

2. Check Angular CLI:
```bash
npm install -g @angular/cli
ng version
```

3. Clear Angular cache:
```bash
rm -rf .angular
rm -rf dist
npm start
```

### Issue: Pages showing 404

**Symptoms:**
- Home page works
- Other pages return 404

**Solutions:**

1. Check file exists:
```bash
ls apps/public/src/pages/profile.astro
```

2. Check route configuration:
```javascript
// In astro.config.mjs
export default defineConfig({
  output: 'server',  // For SSR
  // or
  output: 'static',  // For static pages
});
```

3. Restart dev server.

### Issue: Styles not loading

**Symptoms:**
- Page renders but looks broken
- No CSS applied

**Solutions:**

1. Check CSS import:
```astro
---
import '../styles/global.css';
---
```

2. Check file path:
```bash
ls apps/public/src/styles/global.css
```

3. Clear browser cache (Cmd+Shift+R or Ctrl+Shift+R).

### Issue: API calls failing from frontend

**Symptoms:**
```
Failed to fetch
TypeError: NetworkError when attempting to fetch resource
```

**Solutions:**

1. Check backend is running:
```bash
curl http://localhost:3000/health
```

2. Check API URL in frontend:
```javascript
const API_URL = 'http://localhost:3000';  // Must match backend
```

3. Check CORS (see Backend Issues above).

4. Check browser console for detailed errors (F12).

---

## Performance Issues

### Issue: Slow page loads

**Symptoms:**
- Pages taking > 3 seconds to load

**Solutions:**

1. Check database query performance:
```sql
EXPLAIN ANALYZE SELECT * FROM posts LIMIT 100;
```

2. Add pagination:
```javascript
const posts = await db.query(
  'SELECT * FROM posts ORDER BY created_at DESC LIMIT $1 OFFSET $2',
  [limit, offset]
);
```

3. Add caching:
```javascript
// Simple in-memory cache
const cache = new Map();
const cached = cache.get(key);
if (cached && Date.now() - cached.time < 60000) {
  return cached.data;
}
```

4. Optimize images:
```bash
# Use WebP format
# Reduce file sizes
# Add lazy loading
```

### Issue: High memory usage

**Symptoms:**
```
FATAL ERROR: Reached heap limit
```

**Solutions:**

1. Increase Node.js memory limit:
```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run dev
```

2. Check for memory leaks:
```javascript
// Monitor memory
setInterval(() => {
  const used = process.memoryUsage();
  console.log('Memory:', used.heapUsed / 1024 / 1024, 'MB');
}, 60000);
```

3. Optimize data fetching:
```javascript
// Don't load all records
const posts = await db.query(
  'SELECT * FROM posts LIMIT 100'  // Add limit
);
```

### Issue: CPU usage at 100%

**Symptoms:**
- Server becomes unresponsive
- High CPU in Activity Monitor/Task Manager

**Solutions:**

1. Identify bottleneck:
```bash
# Use Node.js profiler
node --prof node/socialai.node.js
```

2. Optimize database queries:
```sql
-- Add indexes
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
```

3. Add rate limiting:
```javascript
// Limit concurrent requests
const limiter = rateLimit({
  windowMs: 60000,
  max: 100
});
app.use(limiter);
```

---

## Security Issues

### Issue: Database credentials exposed

**Solutions:**

1. **Immediately** change database password:
```sql
ALTER USER postgres PASSWORD 'new_secure_password';
```

2. Update `.env`:
```bash
DATABASE_URL=postgresql://postgres:new_secure_password@localhost:5432/socialai
```

3. Check `.gitignore` includes `.env`:
```bash
echo ".env" >> .gitignore
git rm --cached .env  # If accidentally committed
```

### Issue: Suspicious activity detected

**Solutions:**

1. Check logs for unusual patterns:
```bash
# Backend logs
grep "ERROR" logs.txt
grep "429" logs.txt  # Rate limit hits
```

2. Block IP addresses:
```javascript
// In socialai.node.js
const blockedIPs = ['1.2.3.4'];
app.use((req, res, next) => {
  if (blockedIPs.includes(req.ip)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
});
```

3. Enable stricter rate limiting.

### Issue: XSS vulnerability

**Solutions:**

1. Sanitize user input:
```javascript
const sanitizeHtml = require('sanitize-html');

app.post('/api/posts', async (req, res) => {
  const content = sanitizeHtml(req.body.content);
  // Use sanitized content
});
```

2. Set proper headers:
```javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"]
    }
  }
}));
```

---

## Getting More Help

### Documentation
- [Installation Guide](INSTALLATION.md)
- [Development Guide](DEVELOPMENT.md)
- [API Reference](API.md)
- [Architecture](ARCHITECTURE.md)

### Support Channels
- **GitHub Issues**: https://github.com/SMSDAO/SocialAi/issues
- **Discussions**: https://github.com/SMSDAO/SocialAi/discussions

### Reporting Issues

When reporting an issue, include:

1. **Environment:**
   - OS version
   - Node.js version
   - PostgreSQL version

2. **Steps to reproduce:**
   - What you did
   - What you expected
   - What actually happened

3. **Logs:**
   - Backend logs
   - Browser console errors
   - Database errors

4. **Screenshots** (if applicable)

---

*Last Updated: 2026-02-07*
