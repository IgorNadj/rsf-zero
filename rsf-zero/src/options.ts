import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import {debug} from "./debug.ts";
import { RsfZeroOptions } from "./export-types.ts";

const defaultOptions: RsfZeroOptions = {
  startStatic: {},
}

/**
 * Locate rsf0-config.js in the current project root (process.cwd()).
 */
export function findOptionsFile(cwd: string = process.cwd()): string | null {
  const jsPath = path.join(cwd, 'rsf0-config.js');
  return fs.existsSync(jsPath) ? jsPath : null;
}

/**
 * Dynamically import a JS module by absolute file path.
 */
async function importJsModule(absPath: string): Promise<any> {
  const url = pathToFileURL(absPath).href;
  return import(url);
}

/**
 * Load RSF options from rsf0-config.js at project root.
 * Returns an empty object if no file is found or on safe failure.
 */
export async function loadOptions(): Promise<RsfZeroOptions> {
  const configPath = findOptionsFile();
  if (!configPath) return {};

  try {
    const mod = await importJsModule(configPath);
    const options = (mod && (mod.default ?? mod.options ?? mod.rsf ?? mod.config ?? mod)) as RsfZeroOptions;
    if (options && typeof options === 'object') {
      debug('Options loaded: ' + configPath);
      return options;
    }
    return {};
  } catch (err) {
    // Fail soft: log a friendly message and continue with defaults
    debug('No options file found at: ' + configPath);
    return defaultOptions;
  }
}
