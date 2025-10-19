# 📱 CodeFlow Native Android App Setup

## ✨ Features Implemented

✅ **Native Android APK** - Real mobile app  
✅ **File Associations** - Open .lua, .py, .js files from file manager  
✅ **Discord Rich Presence** - Shows you're coding in Discord  
✅ **Enhanced HTML Preview** - Auto-loads external CSS files  
✅ **Auto-open CSS tabs** - External stylesheets open automatically  
✅ **Encrypted Storage** - Secure file storage  

---

## 🚀 Setup Instructions

### Step 1: Export to GitHub
1. Click the **"Export to GitHub"** button in Lovable
2. Create/connect your GitHub repository
3. Clone the repository to your computer:
```bash
git clone <your-repo-url>
cd <your-repo-name>
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Initialize Capacitor (First time only)
```bash
npx cap init
```
- App ID: `app.lovable.927ee7cdfd384c4583464e0e6f59f45d`
- App Name: `CodeFlow`

### Step 4: Add Android Platform
```bash
npx cap add android
```

### Step 5: Build the Web App
```bash
npm run build
```

### Step 6: Sync to Android
```bash
npx cap sync android
```

### Step 7: Open in Android Studio
```bash
npx cap open android
```

### Step 8: Build APK in Android Studio
1. Android Studio will open
2. Wait for Gradle sync to complete
3. Go to **Build → Build Bundle(s) / APK(s) → Build APK(s)**
4. APK will be in: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 📱 Testing on Device/Emulator

### Run directly:
```bash
npx cap run android
```

---

## 🔥 How File Associations Work

When you tap a .lua, .py, or .js file in your file manager:
1. Android shows "Open with..." dialog
2. **CodeFlow** appears as an option!
3. File opens directly in CodeFlow editor
4. Discord RPC updates to show you're coding

---

## 🎮 Discord Rich Presence

The app automatically updates your Discord status with:
- Current file name
- Programming language
- Lines of code
- Time started coding

---

## 🌐 HTML Preview with External CSS

When you preview HTML:
1. Parser detects external CSS `<link>` tags
2. Automatically fetches CSS content
3. Opens CSS files as new tabs
4. Live updates when you edit CSS

Example:
```html
<link rel="stylesheet" href="styles.css">
```
→ `styles.css` automatically opens in a new tab!

---

## 🔄 Updating the App

When you make code changes:
1. Git pull latest changes: `git pull`
2. Build: `npm run build`
3. Sync: `npx cap sync android`
4. Rebuild APK in Android Studio

---

## 📝 Notes

- **First build takes longer** - Gradle downloads dependencies
- **Hot reload enabled** - Points to your Lovable sandbox for development
- **For production** - Remove the `server.url` from `capacitor.config.ts`
- **File permissions** - Grant storage permissions when first opening files

---

## 🆘 Troubleshooting

**Android Studio not opening?**
- Install Android Studio first: https://developer.android.com/studio

**Build errors?**
- Run `npx cap sync` again
- Clean project in Android Studio: Build → Clean Project

**File associations not working?**
- Check storage permissions in Settings → Apps → CodeFlow

**Discord RPC not showing?**
- Make sure Discord is open and running
- Check console logs for connection status

---

## 🎯 Next Steps

1. Test file opening from file manager
2. Verify Discord RPC integration
3. Test HTML preview with external CSS
4. Build release APK for distribution

Enjoy your native CodeFlow app! 🚀
