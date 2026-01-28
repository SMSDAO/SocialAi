#!/usr/bin/env node

/**
 * AI Worker
 * Handles AI processing tasks (embeddings, summaries, recommendations)
 */

import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const db = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/socialai'
});

const PROCESSING_INTERVAL = 120000; // 2 minutes

class AIWorker {
  constructor() {
    this.name = 'AI';
    this.running = true;
  }

  // Generate embedding (placeholder - would use OpenAI API in production)
  async generateEmbedding(text) {
    // Placeholder: returns a mock embedding
    // In production, would call OpenAI embeddings API
    const mockEmbedding = Array(1536).fill(0).map(() => Math.random());
    return mockEmbedding;
  }

  async processPostEmbeddings() {
    try {
      console.log(`[${this.name}] Processing post embeddings...`);
      
      // Get posts without embeddings
      const result = await db.query(`
        SELECT p.id, p.content 
        FROM posts p
        LEFT JOIN embeddings e ON e.content_id = p.id AND e.content_type = 'post'
        WHERE e.id IS NULL
        LIMIT 10
      `);
      
      for (const post of result.rows) {
        const embedding = await this.generateEmbedding(post.content);
        
        // Store embedding
        await db.query(`
          INSERT INTO embeddings (content_id, content_type, embedding, metadata)
          VALUES ($1, $2, $3, $4)
        `, [
          post.id,
          'post',
          JSON.stringify(embedding), // In production, use pgvector format
          { source: 'post', length: post.content.length }
        ]);
      }
      
      console.log(`[${this.name}] ✅ Processed ${result.rows.length} post embeddings`);
    } catch (error) {
      console.error(`[${this.name}] ❌ Embedding error:`, error.message);
    }
  }

  async processProfileEmbeddings() {
    try {
      console.log(`[${this.name}] Processing profile embeddings...`);
      
      // Get profiles without embeddings
      const result = await db.query(`
        SELECT p.id, p.username, p.display_name, p.bio 
        FROM profiles p
        LEFT JOIN embeddings e ON e.content_id = p.id AND e.content_type = 'profile'
        WHERE e.id IS NULL
        LIMIT 10
      `);
      
      for (const profile of result.rows) {
        const text = [
          profile.username,
          profile.display_name,
          profile.bio
        ].filter(Boolean).join(' ');
        
        const embedding = await this.generateEmbedding(text);
        
        // Store embedding
        await db.query(`
          INSERT INTO embeddings (content_id, content_type, embedding, metadata)
          VALUES ($1, $2, $3, $4)
        `, [
          profile.id,
          'profile',
          JSON.stringify(embedding),
          { source: 'profile', username: profile.username }
        ]);
      }
      
      console.log(`[${this.name}] ✅ Processed ${result.rows.length} profile embeddings`);
    } catch (error) {
      console.error(`[${this.name}] ❌ Profile embedding error:`, error.message);
    }
  }

  async generateSummaries() {
    try {
      console.log(`[${this.name}] Generating content summaries...`);
      
      // Placeholder for generating AI summaries
      // Would use GPT API to generate summaries of long posts
      
      console.log(`[${this.name}] ✅ Summary generation completed`);
    } catch (error) {
      console.error(`[${this.name}] ❌ Summary error:`, error.message);
    }
  }

  async clusterTopics() {
    try {
      console.log(`[${this.name}] Clustering topics...`);
      
      // Placeholder for topic clustering
      // Would use embeddings to cluster similar content
      
      console.log(`[${this.name}] ✅ Topic clustering completed`);
    } catch (error) {
      console.error(`[${this.name}] ❌ Clustering error:`, error.message);
    }
  }

  async start() {
    console.log(`[${this.name}] Worker started`);
    
    // Check if AI features are enabled
    const flagResult = await db.query(
      "SELECT enabled FROM feature_flags WHERE flag_name IN ('ai_summaries', 'ai_recommendations')"
    );
    
    const aiEnabled = flagResult.rows.some(row => row.enabled);
    
    if (!aiEnabled) {
      console.log(`[${this.name}] Worker disabled by feature flags`);
      return;
    }
    
    // Initial processing
    await this.processPostEmbeddings();
    await this.processProfileEmbeddings();
    await this.generateSummaries();
    await this.clusterTopics();
    
    // Periodic processing
    setInterval(async () => {
      if (this.running) {
        await this.processPostEmbeddings();
        await this.processProfileEmbeddings();
        await this.generateSummaries();
        await this.clusterTopics();
      }
    }, PROCESSING_INTERVAL);
  }

  stop() {
    console.log(`[${this.name}] Worker stopping...`);
    this.running = false;
    db.end();
  }
}

// Start worker
const worker = new AIWorker();
worker.start();

// Graceful shutdown
process.on('SIGTERM', () => worker.stop());
process.on('SIGINT', () => worker.stop());
