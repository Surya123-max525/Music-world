# DMG (macOS) App Setup Guide

## 📦 Creating a macOS DMG Distribution Package

### Prerequisites
- macOS 10.13+
- Xcode Command Line Tools
- Node.js 18+

### Step 1: Install Electron Builder

```bash
npm install --save-dev electron electron-builder
npm install --save-dev @types/electron-builder
```

### Step 2: Create Electron Main Process

Create `electron/main.js`:

```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 480,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, '../public/icon.png'),
  });

  const startUrl = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, '../dist/index.html')}`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
```

### Step 3: Configure Build Settings

Update `package.json`:

```json
{
  "name": "masti-music",
  "version": "1.0.0",
  "private": true,
  "homepage": "./",
  "main": "electron/main.js",
  "homepage": "https://github.com/Surya123-max525/Music-world",
  "author": "Surya",
  "description": "Spotify music player for desktop",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "electron": "electron .",
    "electron-dev": "concurrently \"npm run dev\" \"wait-on http://localhost:5173 && electron .\"",
    "electron-build": "npm run build && electron-builder"
  },
  "build": {
    "appId": "com.mastmusic.app",
    "productName": "Masti Music",
    "files": [
      "dist/**/*",
      "electron/main.js",
      "electron/preload.js",
      "node_modules/**/*",
      "package.json"
    ],
    "mac": {
      "target": ["dmg", "zip"],
      "category": "public.app-category.music",
      "icon": "build/icon.icns",
      "hardenedRuntime": true,
      "gatekeeperAssess": false
    },
    "dmg": {
      "icon": "build/icon.icns",
      "iconSize": 100,
      "contents": [
        {
          "x": 110,
          "y": 150,
          "type": "file"
        },
        {
          "x": 240,
          "y": 150,
          "type": "link",
          "path": "/Applications"
        }
      ]
    }
  },
  "devDependencies": {
    "electron": "^latest",
    "electron-builder": "^latest",
    "concurrently": "^latest",
    "wait-on": "^latest"
  }
}
```

### Step 4: Create App Icon

Create a 512x512 PNG icon and convert it to ICNS:

```bash
# On macOS, use Image2Icon or IconKit
# Or online: https://cloudconvert.com/png-to-icns

# Place the icon at: build/icon.icns
# Also place PNG at: public/icon.png
```

### Step 5: Build DMG

```bash
# Install dev dependencies
npm install

# Build the DMG
npm run electron-build
```

The DMG file will be created in the `dist/` folder.

---

## 📋 macOS App Features

✅ Native macOS application  
✅ Works on Big Sur, Monterey, Ventura, Sonoma  
✅ M1/M2/M3 Silicon support  
✅ Optimized for Retina displays  
✅ Dark mode support  
✅ Spotlight search integration  
✅ Keyboard shortcuts  
✅ Menu bar integration  

---

## 🚀 Distribution via DMG

### Manual Distribution
1. Build the DMG: `npm run electron-build`
2. Upload to GitHub Releases
3. Share download link

### Notarization (Apple Requirement)

```bash
# Create app-specific password at https://appleid.apple.com

# Set environment variables
export APPLEID=your-email@apple.com
export APPLEIDPASS=your-app-password

# In electron-builder config, add:
"mac": {
  "notarize": {
    "teamId": "YOUR_TEAM_ID"
  }
}
```

### GitHub Releases

```bash
# Create release
gh release create v1.0.0 dist/Masti\ Music-1.0.0.dmg

# Or upload to existing release
gh release upload v1.0.0 dist/Masti\ Music-1.0.0.dmg
```

### Homebrew Distribution

Create `.github/homebrew-masti-music/Formula/masti-music.rb`:

```ruby
class MastiMusic < Formula
  desc "Spotify music player for desktop"
  homepage "https://github.com/Surya123-max525/Music-world"
  url "https://github.com/Surya123-max525/Music-world/releases/download/v1.0.0/Masti Music-1.0.0.dmg"
  sha256 "YOUR_SHA256_HASH"
  
  app "Masti Music.app"
end
```

Install with:
```bash
brew tap username/masti-music
brew install masti-music
```

---

## 🔧 Advanced Configuration

### Auto-Update

Add to `electron/main.js`:

```javascript
const { autoUpdater } = require('electron-updater');

app.on('ready', () => {
  autoUpdater.checkForUpdatesAndNotify();
  createWindow();
});
```

Update `package.json`:

```json
"build": {
  "publish": {
    "provider": "github",
    "owner": "Surya123-max525",
    "repo": "Music-world"
  }
}
```

### Sign Releases

```bash
export CSC_LINK=path/to/certificate.p12
export CSC_KEY_PASSWORD=password
npm run electron-build
```

---

## 📊 System Requirements

| Requirement | Minimum | Recommended |
|-----------|---------|-------------|
| macOS | 10.13 | 12.0+ |
| RAM | 256 MB | 512 MB+ |
| Storage | 100 MB | 500 MB+ |
| CPU | Intel/ARM | M1+ |

---

## 🐛 Troubleshooting

### "Cannot be opened because the developer cannot be verified"
```bash
# Right-click app → Open
# Or bypass: xattr -d com.apple.quarantine /Applications/Masti\ Music.app
```

### Blank Window on Launch
- Check Vite dev server is running: `npm run dev`
- Verify React components are loading
- Check browser console (F12 in dev mode)

### DMG Won't Mount
- Rebuild DMG: `npm run electron-build`
- Check disk space
- Try online verification tools

---

## 📱 Platform Feature Parity

| Feature | Web | iOS | Android | Chrome | macOS |
|---------|-----|-----|---------|--------|-------|
| Search | ✅ | ✅ | ✅ | ✅ | ✅ |
| Playlists | ✅ | ✅ | ✅ | ✅ | ✅ |
| Preview | ✅ | ✅ | ✅ | ✅ | ✅ |
| Full Play* | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ |
| Offline | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ |

*Requires Spotify Premium & Web Playback SDK

---

## 🎯 Release Checklist

- [ ] Update version in `package.json`
- [ ] Update `CHANGELOG.md`
- [ ] Test on macOS (Intel and Apple Silicon)
- [ ] Build DMG
- [ ] Test DMG installation
- [ ] Create GitHub release
- [ ] Upload DMG to release
- [ ] Update website download links
- [ ] Notify users

---

## 📚 References

- [Electron Documentation](https://www.electronjs.org/docs)
- [Electron Builder](https://www.electron.build)
- [Apple Developer](https://developer.apple.com)
- [Homebrew](https://brew.sh)

---

Ready to distribute Masti Music on macOS! 🎵
