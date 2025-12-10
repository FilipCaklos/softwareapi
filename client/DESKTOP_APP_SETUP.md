# Desktop App Setup & Build Guide

## Quick Start - Build .exe Installer

### Prerequisites
- Node.js (v14 or higher) - Download from https://nodejs.org/
- npm (comes with Node.js)
- Windows 10 or later

### Step 1: Navigate to Client Folder
```powershell
cd client
```

### Step 2: Install Dependencies
```powershell
npm install
```

This installs all required packages including Electron and electron-builder.

### Step 3: Build the Installer

```powershell
npm run build
```

The build process will:
1. Compile the React app
2. Package it with Electron
3. Create Windows installers in the `dist/` folder

**This takes 3-5 minutes depending on your system.**

### Step 4: Find Your Installer

After the build completes, you'll find these files in `client/dist/`:
- `Subscription Service Setup 1.0.0.exe` ← **Use this for installation**
- `Subscription Service 1.0.0.exe` ← Portable standalone version

## Installing the App

### For Users

1. Download `Subscription Service Setup 1.0.0.exe`
2. Run the installer
3. Follow the installation wizard
4. The app will create:
   - **Desktop shortcut** - Quick launch
   - **Start Menu entry** - Under Windows Start Menu
   - **Uninstall option** - In Control Panel

### First Run

1. Launch the app from Desktop or Start Menu
2. The app will appear at http://localhost:3000 (local)
3. You can create accounts or login
4. All data is stored locally on your computer

## Development Testing

To test the app before building:

```powershell
npm run electron-dev
```

This will:
- Start React development server
- Launch the Electron app
- Show developer tools (F12 to toggle)
- Auto-reload on code changes

## Build Configuration

The build is configured in `package.json`:

```json
"build": {
  "appId": "com.subscriptionservice.app",
  "productName": "Subscription Service",
  "win": {
    "target": ["nsis", "portable"],
    "icon": "public/icon.ico"
  },
  "nsis": {
    "oneClick": false,
    "allowToChangeInstallationDirectory": true,
    "createDesktopShortcut": true,
    "createStartMenuShortcut": true
  }
}
```

## Environment Configuration

### For Development
The app connects to the local API by default (http://localhost:5000)

### For Production
Create `.env.production` in the client folder:

```
REACT_APP_API_URL=https://your-production-api.vercel.app
```

Then rebuild to include the production API URL.

## Customization

### Change App Name
Edit `package.json`:
```json
"name": "your-app-name",
"build": {
  "productName": "Your App Name"
}
```

### Change App Icon
Replace or create `public/icon.ico` with your icon file

### Change Window Size
Edit `public/electron.js`:
```javascript
mainWindow = new BrowserWindow({
  width: 1200,    // Change this
  height: 800,    // Change this
  ...
});
```

## Troubleshooting

### Build Fails
**Solution**: Clear cache and rebuild
```powershell
Remove-Item -Recurse node_modules
npm install
npm run build
```

### App Won't Start
1. Check API server is running (if needed)
2. Check `.env.production` API URL is correct
3. Try running `npm run electron-dev` to debug

### Installer Issues
1. Ensure you have admin rights
2. Close any running instances of the app
3. Try the portable `.exe` version instead

### API Connection Issues
1. Verify API server is running on the correct port
2. Check `REACT_APP_API_URL` environment variable
3. Check firewall isn't blocking connections

## Distribution

### Share with Others
The `.exe` installer can be:
- Emailed directly
- Hosted on a server for download
- Shared via cloud storage (Google Drive, OneDrive, etc.)
- Posted on your website

### Uninstall
Users can uninstall like any Windows app:
- Control Panel → Programs → Uninstall a program
- Search "Subscription Service" and click Uninstall
- Or run `Subscription Service Setup.exe` again and choose "Uninstall"

## Advanced: Auto-Update

For adding auto-update functionality, see the Electron documentation at https://www.electronjs.org/docs/latest/api/auto-updater

## File Structure

```
client/
├── public/
│   ├── electron.js      ← Main Electron process
│   ├── preload.js       ← Security layer
│   ├── index.html       ← App HTML
│   └── icon.ico         ← App icon (replace with yours)
├── src/
│   ├── components/      ← React components
│   ├── App.js          ← Main app
│   └── index.js        ← React entry
├── package.json        ← Build config
├── ELECTRON_BUILD.md   ← More details
└── dist/               ← Installers (created after build)
```

## Next Steps

1. **Customize**: Change app icon and name
2. **Test**: Run `npm run electron-dev` and test all features
3. **Build**: Run `npm run build` when ready
4. **Distribute**: Share the `.exe` installer with users
5. **Update**: Modify code and rebuild to create new versions

---

For more help, see `ELECTRON_BUILD.md` in the client folder.
