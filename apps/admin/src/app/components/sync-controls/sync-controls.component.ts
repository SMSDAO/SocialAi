import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SyncService } from '../../services/sync.service';
import { SyncControl } from '../../models/admin.models';

@Component({
  selector: 'app-sync-controls',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sync-controls.component.html',
  styleUrls: ['./sync-controls.component.css']
})
export class SyncControlsComponent implements OnInit {
  syncControls: SyncControl[] = [];
  loading = true;
  error: string | null = null;
  processingSyncs: Set<string> = new Set();

  constructor(private syncService: SyncService) {}

  ngOnInit(): void {
    this.loadSyncControls();
    setInterval(() => this.loadSyncControls(), 15000);
  }

  loadSyncControls(): void {
    this.syncService.getSyncControls().subscribe({
      next: (controls) => {
        this.syncControls = controls;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load sync controls';
        this.loading = false;
      }
    });
  }

  triggerSync(controlId: string): void {
    this.processingSyncs.add(controlId);
    this.syncService.triggerSync(controlId).subscribe({
      next: () => {
        this.processingSyncs.delete(controlId);
        this.loadSyncControls();
      },
      error: (err) => {
        this.processingSyncs.delete(controlId);
        console.error('Failed to trigger sync', err);
      }
    });
  }

  toggleSync(control: SyncControl): void {
    this.processingSyncs.add(control.id);
    this.syncService.toggleSync(control.id, !control.enabled).subscribe({
      next: (updated) => {
        control.enabled = updated.enabled;
        this.processingSyncs.delete(control.id);
      },
      error: (err) => {
        this.processingSyncs.delete(control.id);
        console.error('Failed to toggle sync', err);
      }
    });
  }

  isProcessing(controlId: string): boolean {
    return this.processingSyncs.has(controlId);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString();
  }

  getTimeUntilNextSync(date: Date): string {
    const seconds = Math.floor((new Date(date).getTime() - Date.now()) / 1000);
    if (seconds < 0) return 'Overdue';
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h`;
  }
}
