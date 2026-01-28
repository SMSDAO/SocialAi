import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Worker, ApiResponse } from '../models/admin.models';

@Injectable({
  providedIn: 'root'
})
export class WorkerService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getWorkers(): Observable<Worker[]> {
    return this.http.get<ApiResponse<Worker[]>>(`${this.apiUrl}/workers`).pipe(
      map(response => response.data),
      catchError(() => of(this.getMockWorkers()))
    );
  }

  getWorker(id: string): Observable<Worker> {
    return this.http.get<ApiResponse<Worker>>(`${this.apiUrl}/workers/${id}`).pipe(
      map(response => response.data),
      catchError(() => of(this.getMockWorkers()[0]))
    );
  }

  restartWorker(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/workers/${id}/restart`, {}).pipe(
      catchError(() => of(void 0))
    );
  }

  stopWorker(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/workers/${id}/stop`, {}).pipe(
      catchError(() => of(void 0))
    );
  }

  startWorker(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/workers/${id}/start`, {}).pipe(
      catchError(() => of(void 0))
    );
  }

  private getMockWorkers(): Worker[] {
    return [
      {
        id: '1',
        name: 'Farcaster Worker',
        status: 'healthy',
        type: 'farcaster',
        lastHeartbeat: new Date(),
        uptime: 86400,
        tasksProcessed: 1234,
        errorCount: 5,
        memoryUsage: 256,
        cpuUsage: 45
      },
      {
        id: '2',
        name: 'Reddit Worker',
        status: 'healthy',
        type: 'reddit',
        lastHeartbeat: new Date(),
        uptime: 72000,
        tasksProcessed: 856,
        errorCount: 2,
        memoryUsage: 180,
        cpuUsage: 32
      },
      {
        id: '3',
        name: 'Ethereum RPC',
        status: 'warning',
        type: 'ethereum',
        lastHeartbeat: new Date(Date.now() - 300000),
        uptime: 43200,
        tasksProcessed: 543,
        errorCount: 15,
        memoryUsage: 512,
        cpuUsage: 78
      },
      {
        id: '4',
        name: 'BASE RPC',
        status: 'healthy',
        type: 'base',
        lastHeartbeat: new Date(),
        uptime: 36000,
        tasksProcessed: 432,
        errorCount: 3,
        memoryUsage: 412,
        cpuUsage: 55
      },
      {
        id: '5',
        name: 'Solana RPC',
        status: 'healthy',
        type: 'solana',
        lastHeartbeat: new Date(),
        uptime: 28800,
        tasksProcessed: 678,
        errorCount: 8,
        memoryUsage: 324,
        cpuUsage: 42
      },
      {
        id: '6',
        name: 'Search Worker',
        status: 'healthy',
        type: 'search',
        lastHeartbeat: new Date(),
        uptime: 21600,
        tasksProcessed: 2134,
        errorCount: 12,
        memoryUsage: 768,
        cpuUsage: 65
      },
      {
        id: '7',
        name: 'AI Worker',
        status: 'healthy',
        type: 'ai',
        lastHeartbeat: new Date(),
        uptime: 14400,
        tasksProcessed: 345,
        errorCount: 1,
        memoryUsage: 1024,
        cpuUsage: 88
      }
    ];
  }
}
