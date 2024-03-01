import { registerPlugin } from '@capacitor/core';

const ScreenOrientation = registerPlugin("System", {
  system: () => import("./web").then(m => new m.SystemPlugin())
});
