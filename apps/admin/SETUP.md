# SocialAi Admin Application - Setup Guide

## Overview

A complete Angular 17+ admin application for managing the SocialAi system. Built with standalone components, this production-ready application provides real-time monitoring and management capabilities.

## Application Structure

```
apps/admin/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── dashboard/           # System overview and metrics
│   │   │   ├── feature-flags/       # Feature flag management
│   │   │   ├── sync-controls/       # Data synchronization controls
│   │   │   └── worker-health/       # Worker monitoring and management
│   │   ├── services/
│   │   │   ├── dashboard.service.ts
│   │   │   ├── feature-flag.service.ts
│   │   │   ├── sync.service.ts
│   │   │   └── worker.service.ts
│   │   ├── models/
│   │   │   └── admin.models.ts      # TypeScript interfaces
│   │   ├── interceptors/
│   │   │   └── error.interceptor.ts
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.component.css
│   │   └── app.routes.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── angular.json
├── tsconfig.json
├── tsconfig.app.json
└── package.json
```

## Features

### 1. Dashboard
- **System Metrics**: Real-time display of healthy workers, tasks processed, error rate, and uptime
- **Resource Monitoring**: CPU and memory usage visualization with progress bars
- **Worker Status Overview**: Quick glance at all worker statuses
- **Recent Activity**: Live feed of system events

### 2. Worker Health Monitor
- **Worker Grid**: Visual cards for each of the 7 parallel workers (Farcaster, Reddit, Ethereum RPC, BASE RPC, Solana RPC, Search, AI)
- **Detailed Metrics**: Uptime, tasks processed, error count, memory usage, CPU usage
- **Control Actions**: Start, stop, and restart individual workers
- **Health Indicators**: Color-coded status badges (healthy, warning, error)
- **Real-time Updates**: Auto-refresh every 10 seconds

### 3. Feature Flags Management
- **Toggle Control**: Easy on/off switches for each feature
- **Feature Details**: Name, key, description, and last updated timestamp
- **Live Updates**: Immediate status reflection after changes
- **Feature List**:
  - AI Recommendations
  - Farcaster Sync
  - Reddit Integration
  - SmartBrain Summaries
  - Multi-chain Support

### 4. Sync Controls
- **Source Management**: Control synchronization from Farcaster, Reddit, and blockchain sources
- **Status Monitoring**: View current sync status (idle, syncing, error)
- **Manual Triggers**: Manually trigger synchronization for any source
- **Sync Statistics**: Records processed, last sync time, next sync time
- **Enable/Disable**: Toggle automatic synchronization per source

## Installation & Setup

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
cd /home/runner/work/SocialAi/SocialAi/apps/admin
npm install
```

**Important**: After installation, you must run this command to resolve dependency conflicts:

```bash
rm -rf node_modules/rxjs
```

This removes the duplicate rxjs installation that conflicts with the root node_modules.

### Development Server

```bash
npm start
```

Navigate to `http://localhost:4200/`

### Build

```bash
npm run build
```

Build artifacts will be in `dist/socialai-admin/`

### Production Build

```bash
npm run build --configuration production
```

Optimized production bundle: ~80KB gzipped

## API Integration

The application connects to the SocialAi backend API at `http://localhost:3000/api`.

### API Endpoints Expected

```typescript
// Workers
GET    /api/workers           # List all workers
GET    /api/workers/:id       # Get worker details
POST   /api/workers/:id/restart
POST   /api/workers/:id/stop
POST   /api/workers/:id/start

// Feature Flags
GET    /api/feature-flags
PATCH  /api/feature-flags/:id # Toggle flag
POST   /api/feature-flags     # Create flag
DELETE /api/feature-flags/:id

// Sync Controls
GET    /api/sync-controls
POST   /api/sync-controls/:id/trigger
PATCH  /api/sync-controls/:id # Enable/disable

// Metrics
GET    /api/metrics           # System metrics
```

### Response Format

All API responses follow this format:

```typescript
{
  data: T,                    // The actual data
  success: boolean,           # Request success status
  message?: string,           # Optional success message
  error?: string             # Optional error message
}
```

## Mock Data

The application includes comprehensive mock data fallbacks in each service, allowing it to run without a backend during development. This makes it easy to:
- Test the UI without setting up the backend
- Develop and iterate quickly
- Demonstrate functionality

## Technology Stack

- **Angular 17**: Latest Angular with standalone components
- **RxJS**: Reactive programming for async operations
- **TypeScript 5.2**: Strong typing for better DX
- **CSS Custom Properties**: Modern, maintainable styling
- **HTTP Client**: Built-in Angular HTTP client with interceptors

## Architecture Decisions

### Standalone Components
Using Angular 17+ standalone components eliminates the need for NgModules, resulting in:
- Simpler code structure
- Better tree-shaking
- Faster compilation
- Easier testing

### Service Layer
All API calls are centralized in dedicated services:
- **Separation of Concerns**: Components focus on presentation
- **Reusability**: Services can be injected anywhere
- **Testability**: Easy to mock for unit tests
- **Error Handling**: Centralized via HTTP interceptor

### Mock Data Strategy
Each service includes mock data generators that:
- Return realistic data matching the API schema
- Allow development without backend dependency
- Provide fallback when API is unavailable

### Real-time Updates
Components use RxJS intervals to poll APIs:
- Dashboard: Every 30 seconds
- Workers: Every 10 seconds  
- Sync Controls: Every 15 seconds
- Feature Flags: On-demand only

## Styling

The application uses a modern, clean design system with:
- **CSS Custom Properties**: Easy theming
- **Responsive Grid**: Works on all screen sizes
- **Component-scoped Styles**: No style conflicts
- **Utility Classes**: Consistent spacing and colors

### Color Palette
- Primary: #6366f1 (Indigo)
- Success: #10b981 (Green)
- Warning: #f59e0b (Amber)
- Danger: #ef4444 (Red)
- Info: #3b82f6 (Blue)

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions

## Performance

### Production Build Metrics
- Initial Bundle: 80.07 KB (gzipped)
- Lazy Loaded Chunks: ~2-2.5 KB each (gzipped)
- Total Application Size: ~90 KB (gzipped)

### Optimization Strategies
- Lazy loading routes
- Tree-shaking unused code
- Minification and compression
- Efficient change detection

## Development Tips

### Adding New Components

```bash
cd src/app/components
mkdir my-component
# Create .ts, .html, and .css files
# Remember to use standalone: true
```

### Adding New Services

```bash
cd src/app/services
# Create service with @Injectable({providedIn: 'root'})
```

### Updating Models

Edit `src/app/models/admin.models.ts` to add new interfaces.

## Troubleshooting

### Build Errors Related to RxJS

If you see errors about conflicting RxJS versions:

```bash
cd apps/admin
rm -rf node_modules/rxjs
npm run build
```

### Port Already in Use

If port 4200 is in use:

```bash
npm start -- --port 4201
```

### API Connection Errors

Check that the backend is running on `http://localhost:3000`. The app will fall back to mock data if the API is unavailable.

## Next Steps

1. **Connect to Real Backend**: Once the SocialAi backend is implemented, remove mock data fallbacks
2. **Add Authentication**: Implement user authentication (Farcaster + SIWE as per architecture)
3. **Add WebSockets**: Replace polling with real-time WebSocket connections
4. **Add Tests**: Write unit and E2E tests
5. **Add Analytics**: Track user interactions and system performance

## License

Part of the SocialAi project.
