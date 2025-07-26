import {build as viteBuild, resolveConfig} from 'vite';
import viteReact from '@vitejs/plugin-react';
import {transformRsfForClientPlugin} from "./transformRsfForClientPlugin.js";
import type { Action } from "../types.js";
import {buildServerFiles} from "./buildServerFiles.js";


export const build = async () => {

  const rootDir = (
    await resolveConfig({}, 'build', 'production', 'production')
  ).root;

  // Map used for building the action registry
  const actions: Action[] = [];

  // Build client files
  await viteBuild(
    {
      mode: 'production',
      base: '/',
      plugins: [
        viteReact(),
        transformRsfForClientPlugin(id => actions.push(id)),
      ],
      build: {
        emptyOutDir: true,
        outDir: rootDir + '/dist/client',
      },
    },
  );

  // Build server files
  buildServerFiles(actions, rootDir);

}








