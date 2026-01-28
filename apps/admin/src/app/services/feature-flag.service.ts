import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { FeatureFlag, ApiResponse } from '../models/admin.models';

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getFeatureFlags(): Observable<FeatureFlag[]> {
    return this.http.get<ApiResponse<FeatureFlag[]>>(`${this.apiUrl}/feature-flags`).pipe(
      map(response => response.data),
      catchError(() => of(this.getMockFeatureFlags()))
    );
  }

  toggleFeatureFlag(id: string, enabled: boolean): Observable<FeatureFlag> {
    return this.http.patch<ApiResponse<FeatureFlag>>(
      `${this.apiUrl}/feature-flags/${id}`,
      { enabled }
    ).pipe(
      map(response => response.data),
      catchError(() => {
        const flags = this.getMockFeatureFlags();
        const flag = flags.find(f => f.id === id);
        if (flag) {
          flag.enabled = enabled;
        }
        return of(flag!);
      })
    );
  }

  createFeatureFlag(flag: Partial<FeatureFlag>): Observable<FeatureFlag> {
    return this.http.post<ApiResponse<FeatureFlag>>(`${this.apiUrl}/feature-flags`, flag).pipe(
      map(response => response.data),
      catchError(() => of({
        id: Math.random().toString(),
        name: flag.name || '',
        key: flag.key || '',
        enabled: flag.enabled || false,
        description: flag.description || '',
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );
  }

  deleteFeatureFlag(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/feature-flags/${id}`).pipe(
      catchError(() => of(void 0))
    );
  }

  private getMockFeatureFlags(): FeatureFlag[] {
    return [
      {
        id: '1',
        name: 'AI Recommendations',
        key: 'ai_recommendations',
        enabled: true,
        description: 'Enable AI-powered content recommendations',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Farcaster Sync',
        key: 'farcaster_sync',
        enabled: true,
        description: 'Sync data from Farcaster Hub',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      {
        id: '3',
        name: 'Reddit Integration',
        key: 'reddit_integration',
        enabled: false,
        description: 'Import content from Reddit',
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date()
      },
      {
        id: '4',
        name: 'SmartBrain Summaries',
        key: 'smartbrain_summaries',
        enabled: true,
        description: 'Generate AI summaries using SmartBrain',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date()
      },
      {
        id: '5',
        name: 'Multi-chain Support',
        key: 'multichain_support',
        enabled: true,
        description: 'Enable Ethereum, BASE, and Solana support',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date()
      }
    ];
  }
}
