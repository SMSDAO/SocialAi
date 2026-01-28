import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkerService } from '../../services/worker.service';
import { Worker } from '../../models/admin.models';

@Component({
  selector: 'app-worker-health',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './worker-health.component.html',
  styleUrls: ['./worker-health.component.css']
})
export class WorkerHealthComponent implements OnInit {
  workers: Worker[] = [];
  loading = true;
  error: string | null = null;
  processingWorker: string | null = null;

  constructor(private workerService: WorkerService) {}

  ngOnInit(): void {
    this.loadWorkers();
    setInterval(() => this.loadWorkers(), 10000);
  }

  loadWorkers(): void {
    this.workerService.getWorkers().subscribe({
      next: (workers) => {
        this.workers = workers;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load workers';
        this.loading = false;
      }
    });
  }

  restartWorker(workerId: string): void {
    this.processingWorker = workerId;
    this.workerService.restartWorker(workerId).subscribe({
      next: () => {
        this.processingWorker = null;
        this.loadWorkers();
      },
      error: (err) => {
        this.processingWorker = null;
        console.error('Failed to restart worker', err);
      }
    });
  }

  stopWorker(workerId: string): void {
    this.processingWorker = workerId;
    this.workerService.stopWorker(workerId).subscribe({
      next: () => {
        this.processingWorker = null;
        this.loadWorkers();
      },
      error: (err) => {
        this.processingWorker = null;
        console.error('Failed to stop worker', err);
      }
    });
  }

  startWorker(workerId: string): void {
    this.processingWorker = workerId;
    this.workerService.startWorker(workerId).subscribe({
      next: () => {
        this.processingWorker = null;
        this.loadWorkers();
      },
      error: (err) => {
        this.processingWorker = null;
        console.error('Failed to start worker', err);
      }
    });
  }

  formatUptime(seconds: number): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }

  getTimeSinceLastHeartbeat(date: Date): string {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  }
}
