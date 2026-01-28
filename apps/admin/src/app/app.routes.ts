import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'workers',
    loadComponent: () => import('./components/worker-health/worker-health.component').then(m => m.WorkerHealthComponent)
  },
  {
    path: 'feature-flags',
    loadComponent: () => import('./components/feature-flags/feature-flags.component').then(m => m.FeatureFlagsComponent)
  },
  {
    path: 'sync-controls',
    loadComponent: () => import('./components/sync-controls/sync-controls.component').then(m => m.SyncControlsComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
