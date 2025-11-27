import {Express} from "express";
import path from 'path';
import {RsfZeroConfig} from "./export-types.js";
import {debug} from "./debug.ts";

export const onStartHook = async (options: RsfZeroConfig, app: Express) => {
  const { onStart } = options;

  if (onStart) {
    debug(`onStart config option found`);
    if (typeof onStart !== 'string') {
      throw new Error('Invalid onStart option. Must be a string.');
    }
    const absolutePath = path.isAbsolute(onStart)
      ? onStart
      : path.join(process.cwd(), onStart);

    debug(`Loading onStart from: ${absolutePath}`);
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
    debug(`onStart loaded successfully: ${absolutePath}`);
  }

}
