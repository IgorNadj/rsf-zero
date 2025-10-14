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
      const routeModule = await import(absoluteRoutePath);

      // Route files must export a single function that takes app as first argument
      const [firstExport] = routeModule;

      if (firstExport && typeof firstExport === 'function') {
        firstExport(app);
        debug(`Route loaded successfully: ${routePath}`);
      } else {
        throw new Error(`Route file ${routePath} does not export a valid function`);
      }
    }
  }

}
