import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import {debug} from "./debug.ts";
import { RsfZeroOptions } from "./export-types.ts";

const defaultOptions: RsfZeroOptions = {
  startStatic: {},
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
  const configPath = path.join(process.cwd(), 'rsf0-config.js');

  if (!fs.existsSync(configPath)) {
    debug('No config file found at: ' + configPath);
    return defaultOptions;
  }

  try {
    const mod = await importJsModule(configPath);
    const options = (mod && mod.default) as RsfZeroOptions;
    if (options && typeof options === 'object') {
      debug('Config loaded: ' + configPath);
      return options;
    }
    throw new Error('Invalid');
  } catch (err) {
    console.log('Rsf Zero Error: Invalid config file at: ' + configPath);
    throw err;
  }
}
