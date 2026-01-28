#!/usr/bin/env node

/**
 * Search Worker
 * Handles search indexing and queries
 */

import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const db = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/socialai'
});

const SYNC_INTERVAL = 60000; // 1 minute

class SearchWorker {
  constructor() {
    this.name = 'Search';
    this.running = true;
    this.searchIndex = new Map();
  }

  async indexPosts() {
    try {
      console.log(`[${this.name}] Indexing posts...`);
      
      // Get recent posts
      const result = await db.query(`
        SELECT id, content, created_at FROM posts 
        WHERE created_at > NOW() - INTERVAL '1 hour'
        ORDER BY created_at DESC
      `);
      
      // Build search index (simplified)
      for (const post of result.rows) {
        const words = post.content.toLowerCase().split(/\s+/);
        
        for (const word of words) {
          if (word.length > 2) {
            if (!this.searchIndex.has(word)) {
              this.searchIndex.set(word, []);
            }
            this.searchIndex.get(word).push(post.id);
          }
        }
      }
      
      console.log(`[${this.name}] ✅ Indexed ${result.rows.length} posts`);
    } catch (error) {
      console.error(`[${this.name}] ❌ Indexing error:`, error.message);
    }
  }

  async indexExternalPosts() {
    try {
      console.log(`[${this.name}] Indexing external posts...`);
      
      // Get recent external posts
      const result = await db.query(`
        SELECT id, content, created_at FROM external_posts 
        WHERE created_at > NOW() - INTERVAL '1 hour'
        ORDER BY created_at DESC
      `);
      
      // Build search index
      for (const post of result.rows) {
        if (!post.content) continue;
        
        const words = post.content.toLowerCase().split(/\s+/);
        
        for (const word of words) {
          if (word.length > 2) {
            if (!this.searchIndex.has(word)) {
              this.searchIndex.set(word, []);
            }
            this.searchIndex.get(word).push(post.id);
          }
        }
      }
      
      console.log(`[${this.name}] ✅ Indexed ${result.rows.length} external posts`);
    } catch (error) {
      console.error(`[${this.name}] ❌ Indexing error:`, error.message);
    }
  }

  async indexProfiles() {
    try {
      console.log(`[${this.name}] Indexing profiles...`);
      
      // Get all profiles
      const result = await db.query(`
        SELECT id, username, display_name, bio FROM profiles
      `);
      
      // Build search index
      for (const profile of result.rows) {
        const text = [
          profile.username,
          profile.display_name,
          profile.bio
        ].filter(Boolean).join(' ').toLowerCase();
        
        const words = text.split(/\s+/);
        
        for (const word of words) {
          if (word.length > 2) {
            if (!this.searchIndex.has(word)) {
              this.searchIndex.set(word, []);
            }
            this.searchIndex.get(word).push(profile.id);
          }
        }
      }
      
      console.log(`[${this.name}] ✅ Indexed ${result.rows.length} profiles`);
    } catch (error) {
      console.error(`[${this.name}] ❌ Indexing error:`, error.message);
    }
  }

  search(query) {
    const words = query.toLowerCase().split(/\s+/);
    const results = new Set();
    
    for (const word of words) {
      const matches = this.searchIndex.get(word);
      if (matches) {
        matches.forEach(id => results.add(id));
      }
    }
    
    return Array.from(results);
  }

  async start() {
    console.log(`[${this.name}] Worker started`);
    
    // Initial indexing
    await this.indexPosts();
    await this.indexExternalPosts();
    await this.indexProfiles();
    
    console.log(`[${this.name}] Search index size: ${this.searchIndex.size} terms`);
    
    // Periodic re-indexing
    setInterval(async () => {
      if (this.running) {
        await this.indexPosts();
        await this.indexExternalPosts();
        await this.indexProfiles();
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
const worker = new SearchWorker();
worker.start();

// Graceful shutdown
process.on('SIGTERM', () => worker.stop());
process.on('SIGINT', () => worker.stop());
