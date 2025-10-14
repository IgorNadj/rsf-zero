import path from "path";
import fs from "fs";
import {Action} from "../../types.ts";
import {generateActionRegistryTs, generateEmptyActionRegistryTs} from "../../transform/server/generateActionRegistry.ts";
import {debug} from "../../utils/debug.ts";


export const buildServerFiles = (actions: Action[], rootDir: string) => {
  debug('Building server files.')

  const serverOutDir = path.join(rootDir, 'dist/server');

  // Clear /dist/server before starting
  if (fs.existsSync(serverOutDir)) {
    fs.rmSync(serverOutDir, { recursive: true });
  }
  fs.mkdirSync(serverOutDir, { recursive: true });

  const actionRegistryPath = path.join(serverOutDir, 'actionRegistry.ts');

  // Create the registry
  writeRegistryFile(actions, serverOutDir, actionRegistryPath);

  debug(`Built server with ${actions.length} actions to ${actionRegistryPath}.`);
}

const writeRegistryFile = (actions: Action[], serverOutDir: string, actionRegistryPath: string) => {
  // This file is what the server loads. It imports all the user's actions.
  // It also exports a map of the action id to the action function.
  // We write this file into the user's /src directory, because we don't build, we run ts files directly.

  if (actions.length > 0) {
    const registryContent = generateActionRegistryTs(actions, serverOutDir);
    fs.writeFileSync(actionRegistryPath, registryContent);
    debug('wrote action registry to: ' + actionRegistryPath)
  } else {
    // We still need an empty file for the server
    fs.writeFileSync(actionRegistryPath, generateEmptyActionRegistryTs());
    debug('wrote empty action registry to: ' + actionRegistryPath)
  }
}
