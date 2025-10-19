import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.927ee7cdfd384c4583464e0e6f59f45d',
  appName: 'CodeFlow',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    url: 'https://927ee7cd-fd38-4c45-8346-4e0e6f59f45d.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    App: {
      // File associations for opening .lua, .py, .js files
      handleUrl: true
    }
  },
  android: {
    // Allow opening files from file manager
    allowMixedContent: true,
    captureInput: true
  }
};

export default config;
