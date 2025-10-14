import {Express} from "express";
import path from 'path';
import {RsfZeroConfig} from "./export-types.js";
import {debug} from "./debug.ts";

export const customRoutes = async (options: RsfZeroConfig, app: Express) => {

  if (options.routes) {
    debug(`Routes config option found`);
    if (!Array.isArray(options.routes)) {
      throw new Error('Invalid routes option. Must be an array of strings.');
    }
    for (const routePath of options.routes) {
      const absoluteRoutePath = path.isAbsolute(routePath)
        ? routePath
        : path.join(process.cwd(), routePath);

      debug(`Loading custom route from: ${absoluteRoutePath}`);
      const routeModule: Record<string, any> = await import(absoluteRoutePath);

      const routeExportNames = Object.keys(routeModule);
      if (routeExportNames.length !== 1) {
        throw new Error(`Route file ${routePath} must contain a single export.`);
      }

      const [firstExportName] = routeExportNames;
      const firstExport = routeModule[firstExportName];

      if (! (typeof firstExport === 'function')) {
        throw new Error(`Route file ${routePath} must export a function`);
      }

      firstExport(app);
      debug(`Route loaded successfully: ${routePath}`);
    }
  }

}
