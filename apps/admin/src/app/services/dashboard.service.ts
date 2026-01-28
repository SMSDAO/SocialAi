import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { SystemMetrics, ApiResponse } from '../models/admin.models';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getSystemMetrics(): Observable<SystemMetrics> {
    return this.http.get<ApiResponse<SystemMetrics>>(`${this.apiUrl}/metrics`).pipe(
      map(response => response.data),
      catchError(() => of(this.getMockMetrics()))
    );
  }

  private getMockMetrics(): SystemMetrics {
    return {
      totalWorkers: 7,
      activeWorkers: 7,
      totalTasks: 6222,
      tasksProcessed: 6222,
      errorRate: 0.7,
      uptime: 345600,
      memoryUsage: 3476,
      cpuUsage: 58
    };
  }
}
