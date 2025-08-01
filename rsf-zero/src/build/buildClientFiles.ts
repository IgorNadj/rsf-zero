import path from "path";
import {build as viteBuild} from "vite";
import viteReact from "@vitejs/plugin-react";
import {transformRsfForClientPlugin} from "../transform/client/transformRsfForClientPlugin.ts";
import {Action} from "../types.ts";
import {debug} from "../utils/debug.ts";


export const buildClientFiles = async (rootDir: string, onActionFound: (action: Action) => {}) => {
  let actionCounter = 0; // for logging
  const _onActionFound = (action: Action) => {
    actionCounter++;
    onActionFound(action);
  }

  const clientOutDir = path.join(rootDir, 'dist/client');

  await viteBuild(
    {
      mode: 'production',
      base: '/',
      plugins: [
        viteReact(),
        transformRsfForClientPlugin(_onActionFound),
      ],
      build: {
        emptyOutDir: true,
        outDir: clientOutDir,
      },
    },
  );
  debug(`Built client with ${actionCounter} actions to ${clientOutDir}.`);
}
