import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "chathouse.app",
  appName: "chathouse",
  bundledWebRuntime: false,
  webDir: "out",
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
  cordova: {},
};

export default config;
