import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { SyncControl, ApiResponse } from '../models/admin.models';

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getSyncControls(): Observable<SyncControl[]> {
    return this.http.get<ApiResponse<SyncControl[]>>(`${this.apiUrl}/sync-controls`).pipe(
      map(response => response.data),
      catchError(() => of(this.getMockSyncControls()))
    );
  }

  triggerSync(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/sync-controls/${id}/trigger`, {}).pipe(
      catchError(() => of(void 0))
    );
  }

  toggleSync(id: string, enabled: boolean): Observable<SyncControl> {
    return this.http.patch<ApiResponse<SyncControl>>(
      `${this.apiUrl}/sync-controls/${id}`,
      { enabled }
    ).pipe(
      map(response => response.data),
      catchError(() => {
        const controls = this.getMockSyncControls();
        const control = controls.find(c => c.id === id);
        if (control) {
          control.enabled = enabled;
        }
        return of(control!);
      })
    );
  }

  private getMockSyncControls(): SyncControl[] {
    const now = new Date();
    return [
      {
        id: '1',
        source: 'Farcaster Hub',
        status: 'idle',
        lastSync: new Date(now.getTime() - 3600000),
        nextSync: new Date(now.getTime() + 3600000),
        enabled: true,
        recordsProcessed: 15432
      },
      {
        id: '2',
        source: 'Reddit API',
        status: 'idle',
        lastSync: new Date(now.getTime() - 7200000),
        nextSync: new Date(now.getTime() + 1800000),
        enabled: false,
        recordsProcessed: 8745
      },
      {
        id: '3',
        source: 'Ethereum Blockchain',
        status: 'syncing',
        lastSync: new Date(now.getTime() - 600000),
        nextSync: new Date(now.getTime() + 600000),
        enabled: true,
        recordsProcessed: 234567
      },
      {
        id: '4',
        source: 'BASE Blockchain',
        status: 'idle',
        lastSync: new Date(now.getTime() - 1800000),
        nextSync: new Date(now.getTime() + 1200000),
        enabled: true,
        recordsProcessed: 12345
      },
      {
        id: '5',
        source: 'Solana Blockchain',
        status: 'idle',
        lastSync: new Date(now.getTime() - 2400000),
        nextSync: new Date(now.getTime() + 600000),
        enabled: true,
        recordsProcessed: 45678
      }
    ];
  }
}
