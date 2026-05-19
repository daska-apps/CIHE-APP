import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'au.edu.cihe.portal',
  appName: 'CIHE Portal',
  webDir: 'dist',
  // During development, point to the Vite dev server so you get hot reload on device.
  // Comment this block out before doing a production / App Store build.
  server: {
    url: 'http://192.168.44.184:5173',
    cleartext: true,
  },
};

export default config;
