import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'taskflowai',
  webDir: 'www',
  server: {
    cleartext: true,
  },
};

export default config;
