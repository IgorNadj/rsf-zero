import {Express} from "express";
import path from 'path';
import {RsfZeroConfig} from "./export-types.js";
import {debug} from "./debug.ts";

export const onBeforeStartHook = async (options: RsfZeroConfig, app: Express) => {
  const { onBeforeStart } = options;

  if (onBeforeStart) {
    debug(`onBeforeStart config option found`);
    if (typeof onBeforeStart !== 'string') {
      throw new Error('Invalid onBeforeStart option. Must be a string.');
    }
    const absolutePath = path.isAbsolute(onBeforeStart)
      ? onBeforeStart
      : path.join(process.cwd(), onBeforeStart);

    debug(`Loading onBeforeStart from: ${absolutePath}`);
    const module: Record<string, any> = await import(absolutePath);

    const exportNames = Object.keys(module);
    if (exportNames.length !== 1) {
      throw new Error(`File ${absolutePath} must contain a single export.`);
    }

    const [firstExportName] = exportNames;
    const firstExport = module[firstExportName];

    if (! (typeof firstExport === 'function')) {
      throw new Error(`File ${absolutePath} must export a function`);
    }

    firstExport(app);
    debug(`onBeforeStart loaded successfully: ${absolutePath}`);
  }

}
