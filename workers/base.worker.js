#!/usr/bin/env node

/**
 * BASE RPC Worker
 * Handles BASE blockchain interactions
 */

import pg from 'pg';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const { Pool } = pg;
const db = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/socialai'
});

const BASE_RPC_URL = process.env.BASE_RPC_URL || 'https://mainnet.base.org';
const SYNC_INTERVAL = 30000; // 30 seconds

class BaseWorker {
  constructor() {
    this.name = 'BASE';
    this.running = true;
  }

  async getLatestBlock() {
    try {
      const response = await axios.post(BASE_RPC_URL, {
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
        id: 1
      });
      
      return parseInt(response.data.result, 16);
    } catch (error) {
      console.error(`[${this.name}] ❌ Error getting block:`, error.message);
      return null;
    }
  }

  async verifyAddress(address) {
    try {
      console.log(`[${this.name}] Verifying address on BASE: ${address}`);
      
      const response = await axios.post(BASE_RPC_URL, {
        jsonrpc: '2.0',
        method: 'eth_getBalance',
        params: [address, 'latest'],
        id: 1
      });
      
      const balance = parseInt(response.data.result, 16);
      console.log(`[${this.name}] ✅ Address verified on BASE, balance: ${balance} wei`);
      
      return { valid: true, balance };
    } catch (error) {
      console.error(`[${this.name}] ❌ Verification error:`, error.message);
      return { valid: false, error: error.message };
    }
  }

  async syncUserAddresses() {
    try {
      console.log(`[${this.name}] Syncing user addresses on BASE...`);
      
      // Get users with Ethereum addresses (BASE is EVM compatible)
      const result = await db.query(
        'SELECT id, ethereum_address FROM users WHERE ethereum_address IS NOT NULL LIMIT 10'
      );
      
      for (const user of result.rows) {
        await this.verifyAddress(user.ethereum_address);
      }
      
      console.log(`[${this.name}] ✅ Address sync completed`);
    } catch (error) {
      console.error(`[${this.name}] ❌ Sync error:`, error.message);
    }
  }

  async start() {
    console.log(`[${this.name}] Worker started`);
    
    // Get latest block
    const block = await this.getLatestBlock();
    if (block) {
      console.log(`[${this.name}] Latest BASE block: ${block}`);
    }
    
    // Initial sync
    await this.syncUserAddresses();
    
    // Periodic sync
    setInterval(async () => {
      if (this.running) {
        await this.syncUserAddresses();
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
const worker = new BaseWorker();
worker.start();

// Graceful shutdown
process.on('SIGTERM', () => worker.stop());
process.on('SIGINT', () => worker.stop());
