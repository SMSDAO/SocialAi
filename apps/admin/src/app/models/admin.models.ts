export interface Worker {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'error' | 'stopped';
  type: string;
  lastHeartbeat: Date;
  uptime: number;
  tasksProcessed: number;
  errorCount: number;
  memoryUsage?: number;
  cpuUsage?: number;
}

export interface FeatureFlag {
  id: string;
  name: string;
  key: string;
  enabled: boolean;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SystemMetrics {
  totalWorkers: number;
  activeWorkers: number;
  totalTasks: number;
  tasksProcessed: number;
  errorRate: number;
  uptime: number;
  memoryUsage: number;
  cpuUsage: number;
}

export interface SyncControl {
  id: string;
  source: string;
  status: 'idle' | 'syncing' | 'error';
  lastSync: Date;
  nextSync: Date;
  enabled: boolean;
  recordsProcessed: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}
