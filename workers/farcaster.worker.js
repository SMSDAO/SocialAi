#!/usr/bin/env node

/**
 * Farcaster Worker
 * Syncs data from Farcaster Hub
 */

import pg from 'pg';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const { Pool } = pg;
const db = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/socialai'
});

const FARCASTER_HUB_URL = process.env.FARCASTER_HUB_URL || 'https://hub.farcaster.xyz';
const SYNC_INTERVAL = 60000; // 1 minute

class FarcasterWorker {
  constructor() {
    this.name = 'Farcaster';
    this.running = true;
  }

  async syncCasts() {
    try {
      console.log(`[${this.name}] Syncing casts...`);
      
      // Placeholder for actual Farcaster Hub API calls
      // In production, this would fetch casts from the hub
      
      // Example: Insert or update external posts
      const sampleCast = {
        external_id: `farcaster_${Date.now()}`,
        source: 'farcaster',
        author_id: 'sample_fid',
        author_name: 'sample_user',
        content: 'Sample Farcaster cast',
        metadata: { fid: 1234 }
      };

      await db.query(`
        INSERT INTO external_posts (external_id, source, author_id, author_name, content, metadata)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (external_id) DO UPDATE
        SET synced_at = CURRENT_TIMESTAMP
      `, [
        sampleCast.external_id,
        sampleCast.source,
        sampleCast.author_id,
        sampleCast.author_name,
        sampleCast.content,
        sampleCast.metadata
      ]);

      console.log(`[${this.name}] ✅ Sync completed`);
    } catch (error) {
      console.error(`[${this.name}] ❌ Sync error:`, error.message);
    }
  }

  async syncUsers() {
    try {
      console.log(`[${this.name}] Syncing users...`);
      
      // Placeholder for syncing Farcaster users
      // Would fetch user data from hub and update profiles
      
      console.log(`[${this.name}] ✅ User sync completed`);
    } catch (error) {
      console.error(`[${this.name}] ❌ User sync error:`, error.message);
    }
  }

  async start() {
    console.log(`[${this.name}] Worker started`);
    
    // Initial sync
    await this.syncCasts();
    await this.syncUsers();
    
    // Periodic sync
    setInterval(async () => {
      if (this.running) {
        await this.syncCasts();
        await this.syncUsers();
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
const worker = new FarcasterWorker();
worker.start();

// Graceful shutdown
process.on('SIGTERM', () => worker.stop());
process.on('SIGINT', () => worker.stop());
