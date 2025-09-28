import type serveStatic from "serve-static";
import type { UserConfig } from "vite";

export type RsfZeroConfig = {
  startStatic?: serveStatic.ServeStaticOptions;
}

// For convenience, so that your app doesn't have to have a dependency on vite just to configure it
export type ViteUserConfig = UserConfig;
