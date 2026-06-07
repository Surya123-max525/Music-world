# Mobile & Chrome Extension Setup Guide

## 📱 iOS App Setup (Using Web App)

### Option 1: Add to Home Screen (Recommended)

1. **On iPhone:**
   - Open Safari
   - Go to your deployed app URL
   - Tap the Share button (⬆️)
   - Scroll down and tap "Add to Home Screen"
   - Choose an icon and name
   - Tap "Add"

2. **Features Available:**
   - Full-screen experience like a native app
   - Offline access (with service workers)
   - Access to device features (microphone, camera)

### Option 2: React Native App (Future)

For a fully native iOS experience:
```bash
npx create-expo-app MastiMusic
cd MastiMusic
npm install spotify-sdk react-navigation
```

---

## 🤖 Android App Setup

### Option 1: Add to Home Screen (Chrome)

1. **On Android:**
   - Open Chrome
   - Go to your deployed app URL
   - Tap the menu button (⋮)
   - Tap "Install app" or "Add to Home Screen"
   - Choose "Install"
   - The app will be added to your home screen

2. **Create PWA (Progressive Web App):**
   Add this to `public/manifest.json`:
   ```json
   {
     "name": "Masti Music",
     "short_name": "Masti Music",
     "description": "Spotify music player for all devices",
     "start_url": "/",
     "display": "standalone",
     "scope": "/",
     "theme_color": "#667eea",
     "background_color": "#ffffff",
     "icons": [
       {
         "src": "/icon-192.png",
         "sizes": "192x192",
         "type": "image/png"
       },
       {
         "src": "/icon-512.png",
         "sizes": "512x512",
         "type": "image/png"
       }
     ]
   }
   ```

### Option 2: Build APK

Using React Native CLI:
```bash
npx react-native-cli init MastiMusic
cd MastiMusic
npm install spotify-sdk react-navigation
npx react-native run-android
```

---

## 🧩 Chrome Extension Setup

### Convert Web App to Chrome Extension

1. **Create `manifest.json` in `public/`:**
   ```json
   {
     "manifest_version": 3,
     "name": "Masti Music",
     "version": "1.0.0",
     "description": "Spotify music player extension",
     "permissions": ["storage", "activeTab"],
     "action": {
       "default_popup": "popup.html",
       "default_title": "Masti Music"
     },
     "oauth2": {
       "client_id": "YOUR_SPOTIFY_CLIENT_ID.apps.spotify.com",
       "scopes": [
         "user-read-private",
         "user-read-email",
         "playlist-read-private",
         "playlist-read-public",
         "user-library-read",
         "streaming"
       ]
     }
   }
   ```

2. **Create `public/popup.html`:**
   ```html
   <!DOCTYPE html>
   <html>
   <head>
     <style>
       body {
         width: 400px;
         height: 500px;
         margin: 0;
         font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
       }
       #app { width: 100%; height: 100%; }
     </style>
   </head>
   <body>
     <div id="app"></div>
     <script src="popup.js"></script>
   </body>
   </html>
   ```

3. **Build for Chrome:**
   ```bash
   npm run build
   cd dist
   zip -r ../masti-music-extension.zip .
   ```

4. **Load Extension in Chrome:**
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder
   - Done! Extension will appear in your toolbar

---

## 📦 Build Commands

### Web App (All Platforms)
```bash
# Development
npm run dev

# Production Build
npm run build

# Preview
npm run preview
```

### PWA (Progressive Web App)
```bash
# Add PWA support
npm install workbox-cli

# Generate service workers
workbox generateSW workbox-config.js
```

### Chrome Extension
```bash
# Build and package
npm run build
cd dist && zip -r ../masti-music.zip .
```

---

## 🌐 Deployment Options

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### GitHub Pages
```bash
npm run build
npx gh-pages -d dist
```

### AWS S3 + CloudFront
```bash
npm run build
aws s3 sync dist/ s3://your-bucket-name
```

### Railway, Render, or Heroku
```bash
npm run build
# Follow platform-specific deployment instructions
```

---

## 📋 Platform-Specific Requirements

### iOS
- ✅ Safari 11+
- ✅ Requires HTTPS (except localhost)
- ✅ Supports PWA features
- ✅ Can access microphone, camera, geolocation

### Android
- ✅ Chrome 40+
- ✅ Firefox, Edge, Samsung Internet
- ✅ Full PWA support
- ✅ Can be installed from Google Play (via Google Play Console)

### Chrome
- ✅ Chrome 88+
- ✅ Extension Manifest V3
- ✅ Can be published on Chrome Web Store

### macOS (DMG)
```bash
# Using electron-builder
npm install --save-dev electron-builder electron

# In package.json, add:
"build": {
  "appId": "com.mastmusic.app",
  "productName": "Masti Music",
  "mac": {
    "target": ["dmg", "zip"],
    "icon": "build/icon.icns"
  }
}

# Build DMG
npm run electron-build
```

---

## 🔐 Security Checklist

- [ ] Never commit `.env` files
- [ ] Use HTTPS in production
- [ ] Validate all API requests
- [ ] Implement rate limiting
- [ ] Add CSRF protection
- [ ] Sanitize user inputs
- [ ] Use secure OAuth flow
- [ ] Store tokens securely
- [ ] Enable CORS only for trusted domains
- [ ] Regularly update dependencies

---

## 📱 Native App Development (Future Roadmap)

### React Native
```bash
npx create-expo-app masti-music
npm install spotify-sdk react-navigation @react-navigation/native
```

### Flutter
```bash
flutter create --org com.mastmusic masti_music
flutter pub add spotify
```

### Swift (iOS)
```bash
# Using Xcode
# Add Spotify SDK via CocoaPods
pod install
```

### Kotlin (Android)
```bash
# Android Studio
# Add Spotify SDK to gradle
implementation 'com.spotify.android:auth:2.1.0'
```

---

## 🆘 Troubleshooting

### PWA Not Installing
- Check `manifest.json` is valid
- Ensure HTTPS is enabled
- Verify icons are properly sized
- Check browser console for errors

### Chrome Extension Not Loading
- Enable Developer Mode
- Verify `manifest.json` syntax
- Check `manifest_version` is 3
- Reload extension after changes

### OAuth Not Working
- Verify Redirect URI matches exactly
- Check Client ID and Secret
- Ensure scope permissions are correct
- Check browser console for errors

---

## 📚 Resources

- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Chrome Extensions Docs](https://developer.chrome.com/docs/extensions/mv3/)
- [Spotify SDK](https://developer.spotify.com/documentation/web-api)
- [React Native](https://reactnative.dev)
- [Electron](https://www.electronjs.org)
- [Flutter](https://flutter.dev)

---

Created with ❤️ for music lovers on all platforms!
