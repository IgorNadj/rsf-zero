import type serveStatic from "serve-static";

export type { ActionRegistry } from "../types.ts";

export type RsfZeroConfig = {
  startStatic?: serveStatic.ServeStaticOptions;
  routes?: string[];
  onStart?: string;
}
