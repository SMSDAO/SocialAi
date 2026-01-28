#!/usr/bin/env node

/**
 * Ethereum RPC Worker
 * Handles Ethereum blockchain interactions
 */

import pg from 'pg';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const { Pool } = pg;
const db = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/socialai'
});

const ETH_RPC_URL = process.env.ETH_RPC_URL || 'https://eth.llamarpc.com';
const SYNC_INTERVAL = 30000; // 30 seconds

class EthereumWorker {
  constructor() {
    this.name = 'Ethereum';
    this.running = true;
  }

  async getLatestBlock() {
    try {
      const response = await axios.post(ETH_RPC_URL, {
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
      console.log(`[${this.name}] Verifying address: ${address}`);
      
      const response = await axios.post(ETH_RPC_URL, {
        jsonrpc: '2.0',
        method: 'eth_getBalance',
        params: [address, 'latest'],
        id: 1
      });
      
      const balance = parseInt(response.data.result, 16);
      console.log(`[${this.name}] ✅ Address verified, balance: ${balance} wei`);
      
      return { valid: true, balance };
    } catch (error) {
      console.error(`[${this.name}] ❌ Verification error:`, error.message);
      return { valid: false, error: error.message };
    }
  }

  async syncUserAddresses() {
    try {
      console.log(`[${this.name}] Syncing user addresses...`);
      
      // Get users with Ethereum addresses
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
      console.log(`[${this.name}] Latest block: ${block}`);
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
const worker = new EthereumWorker();
worker.start();

// Graceful shutdown
process.on('SIGTERM', () => worker.stop());
process.on('SIGINT', () => worker.stop());
