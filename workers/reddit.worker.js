#!/usr/bin/env node

/**
 * Reddit Worker
 * Syncs data from Reddit
 */

import pg from 'pg';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const { Pool } = pg;
const db = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/socialai'
});

const REDDIT_API_URL = 'https://www.reddit.com';
const SYNC_INTERVAL = 120000; // 2 minutes

class RedditWorker {
  constructor() {
    this.name = 'Reddit';
    this.running = true;
    this.subreddits = ['cryptocurrency', 'ethereum', 'web3'];
  }

  async syncPosts(subreddit) {
    try {
      console.log(`[${this.name}] Syncing r/${subreddit}...`);
      
      // Fetch from Reddit API (public endpoint, no auth required for reading)
      const response = await axios.get(`${REDDIT_API_URL}/r/${subreddit}/hot.json?limit=25`, {
        headers: { 'User-Agent': 'SocialAi/0.1' }
      });

      const posts = response.data.data.children;

      for (const post of posts) {
        const data = post.data;
        
        await db.query(`
          INSERT INTO external_posts (external_id, source, author_id, author_name, content, url, metadata)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (external_id) DO UPDATE
          SET synced_at = CURRENT_TIMESTAMP
        `, [
          `reddit_${data.id}`,
          'reddit',
          data.author,
          data.author,
          data.title + '\n\n' + (data.selftext || ''),
          data.url,
          { subreddit, score: data.score, num_comments: data.num_comments }
        ]);
      }

      console.log(`[${this.name}] ✅ Synced ${posts.length} posts from r/${subreddit}`);
    } catch (error) {
      console.error(`[${this.name}] ❌ Sync error for r/${subreddit}:`, error.message);
    }
  }

  async start() {
    console.log(`[${this.name}] Worker started`);
    
    // Check if Reddit sync is enabled
    const flagResult = await db.query(
      "SELECT enabled FROM feature_flags WHERE flag_name = 'reddit_sync'"
    );
    
    if (!flagResult.rows[0]?.enabled) {
      console.log(`[${this.name}] Worker disabled by feature flag`);
      return;
    }
    
    // Initial sync
    for (const subreddit of this.subreddits) {
      await this.syncPosts(subreddit);
    }
    
    // Periodic sync
    setInterval(async () => {
      if (this.running) {
        for (const subreddit of this.subreddits) {
          await this.syncPosts(subreddit);
        }
      }
    }, SYNC_INTERVAL);
  }

  stop() {
    console.log(`[${this.name}] Worker stopping...`);
    this.running = false;
    db.end();
  }
}

// Start worker
const worker = new RedditWorker();
worker.start();

// Graceful shutdown
process.on('SIGTERM', () => worker.stop());
process.on('SIGINT', () => worker.stop());
