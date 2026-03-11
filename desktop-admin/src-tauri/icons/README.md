# Tauri App Icons

This directory should contain the application icons for the desktop admin app.

## Required Icons

For a complete Tauri build, you need:
- `32x32.png` - 32x32 pixel PNG icon
- `128x128.png` - 128x128 pixel PNG icon
- `128x128@2x.png` - 256x256 pixel PNG icon (2x retina)
- `icon.icns` - macOS icon file
- `icon.ico` - Windows icon file

## Generating Icons

You can use the Tauri CLI to generate icons from a single source image:

```bash
npm install -g @tauri-apps/cli
tauri icon path/to/your/icon.png
```

The source image should be at least 1024x1024 pixels and in PNG format.

## Placeholder Icons

Until proper icons are created, the build will use Tauri's default icons.
Remove or update the `icon` configuration in `tauri.conf.json` if you don't have custom icons ready.
