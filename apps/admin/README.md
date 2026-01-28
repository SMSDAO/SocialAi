# SocialAi Admin

Angular admin application for managing the SocialAi system.

## Features

- **Dashboard**: Real-time system metrics and overview
- **Worker Health**: Monitor and manage parallel workers
- **Feature Flags**: Toggle features on/off across the system
- **Sync Controls**: Manage data synchronization from external sources

## Development

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Development Server

```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Build

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Architecture

This application connects to the SocialAi backend API at `http://localhost:3000` and provides a comprehensive admin interface for:

- Monitoring worker health and system metrics
- Managing feature flags
- Controlling data synchronization
- Viewing system activity

Built with Angular 17+ standalone components for optimal performance and modern development experience.
