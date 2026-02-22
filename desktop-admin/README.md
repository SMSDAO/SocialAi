# SocialAi Desktop Admin

## Windows Admin Desktop App (Tauri)

This is a lightweight desktop admin application built with Tauri for Windows.

### Features
- Local admin control panel
- Embedded admin UI from `http://localhost:4200`
- Lightweight (<5MB installer)
- Native Windows performance

### Prerequisites
- Node.js 24+
- Rust (latest stable)
- Windows 10/11

### Building for Windows

#### 1. Install Rust
```powershell
# For Windows, download and run rustup-init.exe from:
# https://rustup.rs/
# Or use winget:
winget install Rustlang.Rustup
```

#### 2. Install dependencies
```bash
cd desktop-admin
npm install
```

#### 3. Build for Windows
```bash
# Development mode
npm run dev

# Production build
npm run build:windows
```

The installer will be created in `src-tauri/target/release/bundle/`.

### Files
- `admin.exe` - Main executable (located in bundle folder after build)
- `admin.msi` - MSI installer
- `admin-setup.exe` - NSIS installer

### Configuration
Edit `src-tauri/tauri.conf.json` to customize:
- Window size and appearance
- Bundle settings
- Security policies
- URLs and endpoints

### Usage
1. Start the SocialAi backend: `npm run dev` (from root)
2. Start the admin UI: `npm run dev:admin` (from root)
3. Launch the desktop app: Run `admin.exe` or use `npm run dev`

### Connecting to Local Admin
The app connects to `http://localhost:4200` by default.
Ensure the admin Angular app is running before launching the desktop app.
