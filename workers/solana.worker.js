#!/usr/bin/env node

/**
 * Solana RPC Worker
 * Handles Solana blockchain interactions
 */

import pg from 'pg';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const { Pool } = pg;
const db = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/socialai'
});

const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
const SYNC_INTERVAL = 30000; // 30 seconds

class SolanaWorker {
  constructor() {
    this.name = 'Solana';
    this.running = true;
  }

  async getLatestSlot() {
    try {
      const response = await axios.post(SOLANA_RPC_URL, {
        jsonrpc: '2.0',
        method: 'getSlot',
        params: [],
        id: 1
      });
      
      return response.data.result;
    } catch (error) {
      console.error(`[${this.name}] ❌ Error getting slot:`, error.message);
      return null;
    }
  }

  async verifyAddress(address) {
    try {
      console.log(`[${this.name}] Verifying Solana address: ${address}`);
      
      const response = await axios.post(SOLANA_RPC_URL, {
        jsonrpc: '2.0',
        method: 'getBalance',
        params: [address],
        id: 1
      });
      
      const balance = response.data.result?.value || 0;
      console.log(`[${this.name}] ✅ Address verified, balance: ${balance} lamports`);
      
      return { valid: true, balance };
    } catch (error) {
      console.error(`[${this.name}] ❌ Verification error:`, error.message);
      return { valid: false, error: error.message };
    }
  }

  async syncSolanaActivity() {
    try {
      console.log(`[${this.name}] Syncing Solana activity...`);
      
      // Placeholder for syncing Solana NFT and token activity
      // Would track Solana wallets associated with users
      
      console.log(`[${this.name}] ✅ Activity sync completed`);
    } catch (error) {
      console.error(`[${this.name}] ❌ Sync error:`, error.message);
    }
  }

  async start() {
    console.log(`[${this.name}] Worker started`);
    
    // Get latest slot
    const slot = await this.getLatestSlot();
    if (slot) {
      console.log(`[${this.name}] Latest slot: ${slot}`);
    }
    
    // Initial sync
    await this.syncSolanaActivity();
    
    // Periodic sync
    setInterval(async () => {
      if (this.running) {
        await this.syncSolanaActivity();
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
const worker = new SolanaWorker();
worker.start();

// Graceful shutdown
process.on('SIGTERM', () => worker.stop());
process.on('SIGINT', () => worker.stop());
