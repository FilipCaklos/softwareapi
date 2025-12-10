# Building the Desktop Application

## Prerequisites

- Node.js and npm installed
- Windows (for .exe build), macOS (for .dmg), or Linux (for AppImage)

## Build Steps

### 1. Install Dependencies

```bash
cd client
npm install
```

### 2. Build for Development

To test the Electron app locally:

```bash
npm run electron-dev
```

This will:
- Start the React development server
- Launch the Electron app
- Allow you to test the application

### 3. Create Installer (.exe for Windows)

```bash
npm run build
```

This will:
- Build the React application
- Package it with Electron
- Create an installer executable

The `.exe` installer will be in `client/dist/` folder.

### Output Files

After building, you'll find:
- `Subscription Service Setup 1.0.0.exe` - NSIS installer (recommended)
- `Subscription Service 1.0.0.exe` - Portable standalone executable

## Installation

Users can run the `.exe` installer to install the application on their computer. The installer will:
- Create a Start Menu shortcut
- Create a Desktop shortcut
- Add uninstall option in Control Panel

## Building for Other Platforms

### macOS (from macOS)
```bash
npm run build
```
Creates `.dmg` and `.zip` files

### Linux (from Linux)
```bash
npm run build
```
Creates `.AppImage` and `.deb` files

## Configuration

The app is configured in `package.json` under the `"build"` section:
- `appId`: Unique identifier for the application
- `productName`: Name shown in installer and Start Menu
- `nsis`: Windows installer options
- `win`, `mac`, `linux`: Platform-specific settings

## API Configuration

For production builds, ensure `.env.production` is set correctly:

```
REACT_APP_API_URL=https://your-production-api.com
```

## Troubleshooting

**Issue**: Build fails with icon error
**Solution**: Ensure `icon.ico` exists in the `public/` folder, or the build will use a default icon

**Issue**: App won't connect to API
**Solution**: Check the API URL in `.env.production` is correct and accessible

**Issue**: Installer won't run
**Solution**: Make sure you're on Windows and have administrator permissions
