import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { WorkerService } from '../../services/worker.service';
import { SystemMetrics, Worker } from '../../models/admin.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  metrics: SystemMetrics | null = null;
  workers: Worker[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private dashboardService: DashboardService,
    private workerService: WorkerService
  ) {}

  ngOnInit(): void {
    this.loadData();
    setInterval(() => this.loadData(), 30000);
  }

  loadData(): void {
    this.dashboardService.getSystemMetrics().subscribe({
      next: (metrics) => {
        this.metrics = metrics;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load metrics';
        this.loading = false;
      }
    });

    this.workerService.getWorkers().subscribe({
      next: (workers) => {
        this.workers = workers;
      },
      error: (err) => {
        console.error('Failed to load workers', err);
      }
    });
  }

  formatUptime(seconds: number): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }

  getHealthyWorkersCount(): number {
    return this.workers.filter(w => w.status === 'healthy').length;
  }
}
