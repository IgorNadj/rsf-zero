import {build as viteBuild} from "vite";
import viteReact from "@vitejs/plugin-react";
import {transformRsfForClientPlugin} from "../utils/transformRsfForClientPlugin.ts";
import {Action} from "../types.ts";


export const buildClientFiles = async (rootDir: string, onActionFound: (action: Action) => {}) => {
  await viteBuild(
    {
      mode: 'production',
      base: '/',
      plugins: [
        viteReact(),
        transformRsfForClientPlugin(onActionFound),
      ],
      build: {
        emptyOutDir: true,
        outDir: rootDir + '/dist/client',
      },
    },
  );
}
