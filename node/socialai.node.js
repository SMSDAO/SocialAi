#!/usr/bin/env node

/**
 * SocialAi One-File Node Orchestrator
 * 
 * This file contains all backend orchestration:
 * - Healdec Engine (auto-healing)
 * - Worker Manager (parallel worker orchestration)
 * - API Gateway (REST endpoints, auth, rate limiting)
 * - SSR Renderer (Astro SSR integration)
 * - SmartBrain Integration (AI features)
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pg from 'pg';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  port: process.env.PORT || 3000,
  dbUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/socialai',
  workers: {
    farcaster: { enabled: true, path: '../workers/farcaster.worker.js' },
    reddit: { enabled: false, path: '../workers/reddit.worker.js' },
    ethereum: { enabled: true, path: '../workers/ethereum.worker.js' },
    base: { enabled: true, path: '../workers/base.worker.js' },
    solana: { enabled: true, path: '../workers/solana.worker.js' },
    search: { enabled: true, path: '../workers/search.worker.js' },
    ai: { enabled: true, path: '../workers/ai.worker.js' }
  },
  healdec: {
    healthCheckInterval: 30000, // 30 seconds
    restartDelay: 5000, // 5 seconds
    maxRestarts: 3
  }
};

// ============================================================================
// DATABASE CONNECTION
// ============================================================================

const { Pool } = pg;
const db = new Pool({ connectionString: CONFIG.dbUrl });

// Test database connection
db.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ Database connected:', res.rows[0].now);
  }
});

// ============================================================================
// HEALDEC ENGINE
// ============================================================================

class HealdecEngine {
  constructor() {
    this.healthChecks = new Map();
    this.restartCounts = new Map();
  }

  // Dependency scanning (checks if workers are healthy)
  async scanDependencies() {
    console.log('🔍 [Healdec] Scanning dependencies...');
    const results = [];
    
    for (const [name, worker] of Object.entries(CONFIG.workers)) {
      if (!worker.enabled) continue;
      
      const health = await this.checkWorkerHealth(name);
      results.push({ name, healthy: health });
    }
    
    return results;
  }

  // Safe update (validates before applying changes)
  async safeUpdate(target, updateFn) {
    console.log(`🔄 [Healdec] Safe update for ${target}...`);
    
    // Validate before update
    const validated = await this.validate(target);
    if (!validated) {
      console.error(`❌ [Healdec] Validation failed for ${target}`);
      return false;
    }
    
    // Apply update
    try {
      await updateFn();
      console.log(`✅ [Healdec] Update completed for ${target}`);
      return true;
    } catch (error) {
      console.error(`❌ [Healdec] Update failed for ${target}:`, error.message);
      await this.rollback(target);
      return false;
    }
  }

  // Rebuild (restart worker or service)
  async rebuild(target) {
    console.log(`🔨 [Healdec] Rebuilding ${target}...`);
    // Implementation for rebuilding workers
    return true;
  }

  // Validation
  async validate(target) {
    console.log(`✔️  [Healdec] Validating ${target}...`);
    // Basic validation - check if worker exists and is configured
    return CONFIG.workers[target] !== undefined;
  }

  // Rollback (restore previous state)
  async rollback(target) {
    console.log(`↩️  [Healdec] Rolling back ${target}...`);
    // Implementation for rollback
    return true;
  }

  // Check worker health
  async checkWorkerHealth(workerName) {
    // Simple health check - in production, this would ping the worker
    return this.healthChecks.get(workerName) || false;
  }

  // Set worker health status
  setWorkerHealth(workerName, healthy) {
    this.healthChecks.set(workerName, healthy);
  }

  // Start health monitoring
  startMonitoring() {
    setInterval(async () => {
      const results = await this.scanDependencies();
      results.forEach(({ name, healthy }) => {
        if (!healthy) {
          console.warn(`⚠️  [Healdec] Worker ${name} unhealthy, attempting restart...`);
          workerManager.restartWorker(name);
        }
      });
    }, CONFIG.healdec.healthCheckInterval);
  }
}

// ============================================================================
// WORKER MANAGER
// ============================================================================

class WorkerManager {
  constructor() {
    this.workers = new Map();
    this.restartCounts = new Map();
  }

  // Start all workers
  async startWorkers() {
    console.log('🚀 [Worker Manager] Starting workers...');
    
    for (const [name, config] of Object.entries(CONFIG.workers)) {
      if (config.enabled) {
        this.startWorker(name, config);
      }
    }
  }

  // Start a single worker
  startWorker(name, config) {
    const workerPath = join(__dirname, config.path);
    
    console.log(`▶️  [Worker Manager] Starting ${name} worker...`);
    
    const worker = spawn('node', [workerPath], {
      stdio: 'pipe',
      env: { ...process.env, WORKER_NAME: name }
    });

    worker.stdout.on('data', (data) => {
      console.log(`[${name}] ${data.toString().trim()}`);
    });

    worker.stderr.on('data', (data) => {
      console.error(`[${name}] ERROR: ${data.toString().trim()}`);
    });

    worker.on('exit', (code) => {
      console.log(`[${name}] Exited with code ${code}`);
      healdec.setWorkerHealth(name, false);
      
      // Auto-restart on failure
      if (code !== 0) {
        this.handleWorkerFailure(name, config);
      }
    });

    this.workers.set(name, worker);
    healdec.setWorkerHealth(name, true);
    
    console.log(`✅ [Worker Manager] ${name} worker started`);
  }

  // Restart a worker
  restartWorker(name) {
    const config = CONFIG.workers[name];
    if (!config) return;

    const restartCount = this.restartCounts.get(name) || 0;
    
    if (restartCount >= CONFIG.healdec.maxRestarts) {
      console.error(`❌ [Worker Manager] Max restarts reached for ${name}`);
      return;
    }

    console.log(`🔄 [Worker Manager] Restarting ${name} worker...`);
    
    // Stop existing worker
    const worker = this.workers.get(name);
    if (worker) {
      worker.kill();
      this.workers.delete(name);
    }

    // Restart after delay
    setTimeout(() => {
      this.startWorker(name, config);
      this.restartCounts.set(name, restartCount + 1);
    }, CONFIG.healdec.restartDelay);
  }

  // Handle worker failure
  handleWorkerFailure(name, config) {
    console.error(`❌ [Worker Manager] Worker ${name} failed`);
    this.restartWorker(name);
  }

  // Health check for all workers
  async performHealthChecks() {
    console.log('💚 [Worker Manager] Performing health checks...');
    
    for (const [name, worker] of this.workers) {
      const isAlive = worker && !worker.killed;
      healdec.setWorkerHealth(name, isAlive);
      
      if (!isAlive) {
        console.warn(`⚠️  [Worker Manager] Worker ${name} is not responsive`);
      }
    }
  }

  // Start health check interval
  startHealthChecks() {
    setInterval(() => {
      this.performHealthChecks();
    }, CONFIG.healdec.healthCheckInterval);
  }
}

// ============================================================================
// API GATEWAY
// ============================================================================

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: 'Too many requests, please try again later.'
});

app.use('/api/', limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    workers: Array.from(healdec.healthChecks.entries()).map(([name, healthy]) => ({
      name,
      healthy
    }))
  });
});

// ============================================================================
// REST ENDPOINTS
// ============================================================================

// Users
app.get('/api/users', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users LIMIT 100');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Profiles
app.get('/api/profiles', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM profiles LIMIT 100');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/profiles/:username', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM profiles WHERE username = $1', [req.params.username]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Posts
app.get('/api/posts', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM posts ORDER BY created_at DESC LIMIT 100');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/posts/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM posts WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// External Posts
app.get('/api/external-posts', async (req, res) => {
  try {
    const { source } = req.query;
    let query = 'SELECT * FROM external_posts';
    const params = [];
    
    if (source) {
      query += ' WHERE source = $1';
      params.push(source);
    }
    
    query += ' ORDER BY created_at DESC LIMIT 100';
    
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Timelines
app.get('/api/timeline/:username', async (req, res) => {
  try {
    // Get user's posts and posts from followed users
    const result = await db.query(`
      SELECT p.*, pr.username, pr.display_name, pr.avatar_url
      FROM posts p
      JOIN profiles pr ON p.user_id = pr.user_id
      JOIN follows f ON f.following_id = pr.user_id
      JOIN profiles my_profile ON f.follower_id = my_profile.user_id
      WHERE my_profile.username = $1
      ORDER BY p.created_at DESC
      LIMIT 100
    `, [req.params.username]);
    
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Feature Flags
app.get('/api/feature-flags', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM feature_flags');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/feature-flags/:name', async (req, res) => {
  try {
    const { enabled } = req.body;
    const result = await db.query(
      'UPDATE feature_flags SET enabled = $1, updated_at = CURRENT_TIMESTAMP WHERE flag_name = $2 RETURNING *',
      [enabled, req.params.name]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Feature flag not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Settings
app.get('/api/settings', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM settings');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Worker status
app.get('/api/workers/status', (req, res) => {
  const workers = Array.from(healdec.healthChecks.entries()).map(([name, healthy]) => ({
    name,
    healthy,
    enabled: CONFIG.workers[name]?.enabled || false
  }));
  
  res.json(workers);
});

// ============================================================================
// SSR RENDERER
// ============================================================================

class SSRRenderer {
  constructor() {
    this.astroPath = join(__dirname, '../apps/public');
  }

  // Render profile page
  async renderProfile(username) {
    console.log(`🎨 [SSR] Rendering profile for ${username}...`);
    
    try {
      const profile = await db.query('SELECT * FROM profiles WHERE username = $1', [username]);
      if (profile.rows.length === 0) {
        return null;
      }
      
      return {
        profile: profile.rows[0],
        rendered: true
      };
    } catch (error) {
      console.error('[SSR] Profile render error:', error);
      return null;
    }
  }

  // Render timeline
  async renderTimeline(username) {
    console.log(`🎨 [SSR] Rendering timeline for ${username}...`);
    
    try {
      const posts = await db.query(`
        SELECT p.*, pr.username, pr.display_name, pr.avatar_url
        FROM posts p
        JOIN profiles pr ON p.user_id = pr.user_id
        WHERE pr.username = $1
        ORDER BY p.created_at DESC
        LIMIT 50
      `, [username]);
      
      return {
        posts: posts.rows,
        rendered: true
      };
    } catch (error) {
      console.error('[SSR] Timeline render error:', error);
      return null;
    }
  }
}

// ============================================================================
// SMARTBRAIN INTEGRATION
// ============================================================================

class SmartBrainIntegration {
  constructor() {
    this.enabled = true;
  }

  // Generate content summary
  async generateSummary(content) {
    console.log('🧠 [SmartBrain] Generating summary...');
    // Placeholder for AI summary generation
    return {
      summary: content.substring(0, 100) + '...',
      topics: [],
      sentiment: 'neutral'
    };
  }

  // Get recommendations
  async getRecommendations(userId) {
    console.log('🧠 [SmartBrain] Getting recommendations...');
    
    try {
      // Get similar users based on follows and likes
      const result = await db.query(`
        SELECT DISTINCT pr.* 
        FROM profiles pr
        JOIN follows f ON f.following_id = pr.user_id
        WHERE f.follower_id != $1
        LIMIT 10
      `, [userId]);
      
      return result.rows;
    } catch (error) {
      console.error('[SmartBrain] Recommendations error:', error);
      return [];
    }
  }

  // Topic clustering
  async clusterTopics(posts) {
    console.log('🧠 [SmartBrain] Clustering topics...');
    // Placeholder for topic clustering
    return {
      clusters: [],
      topics: []
    };
  }

  // Profile optimization
  async optimizeProfile(profileId) {
    console.log('🧠 [SmartBrain] Optimizing profile...');
    // Placeholder for profile optimization
    return {
      suggestions: [],
      score: 0
    };
  }
}

// SmartBrain API endpoints
app.get('/api/ai/summary/:postId', async (req, res) => {
  try {
    const post = await db.query('SELECT * FROM posts WHERE id = $1', [req.params.postId]);
    if (post.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const summary = await smartBrain.generateSummary(post.rows[0].content);
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/ai/recommendations/:userId', async (req, res) => {
  try {
    const recommendations = await smartBrain.getRecommendations(req.params.userId);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================================
// INITIALIZATION
// ============================================================================

const healdec = new HealdecEngine();
const workerManager = new WorkerManager();
const ssrRenderer = new SSRRenderer();
const smartBrain = new SmartBrainIntegration();

async function initialize() {
  console.log('🚀 SocialAi Node Orchestrator Starting...');
  console.log('='.repeat(50));
  
  // Start Healdec monitoring
  console.log('🏥 Starting Healdec Engine...');
  healdec.startMonitoring();
  
  // Start workers
  await workerManager.startWorkers();
  workerManager.startHealthChecks();
  
  // Start API server
  app.listen(CONFIG.port, () => {
    console.log('='.repeat(50));
    console.log(`✅ SocialAi Node running on port ${CONFIG.port}`);
    console.log(`📊 API Gateway: http://localhost:${CONFIG.port}`);
    console.log(`💚 Health Check: http://localhost:${CONFIG.port}/health`);
    console.log('='.repeat(50));
  });
}

// Start the system
initialize().catch(error => {
  console.error('❌ Failed to initialize:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Shutting down gracefully...');
  
  // Stop all workers
  for (const [name, worker] of workerManager.workers) {
    console.log(`Stopping ${name} worker...`);
    worker.kill();
  }
  
  // Close database connection
  db.end();
  
  process.exit(0);
});
