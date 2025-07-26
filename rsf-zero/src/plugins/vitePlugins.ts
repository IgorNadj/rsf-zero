import type { Plugin } from "vite";
import { isServerActionFile } from "../utils/isServerActionFile.ts";
import { getActionName } from "../utils/getActionName.ts";
import { transformRsfForClient } from "../transform/transformRsfForClient.js";
import type { RegisterServerAction } from "../server/actionHandler.js";


export const vitePlugins = (
  onServerActionFound: RegisterServerAction,
): Plugin[] => {

  // Map needed for both plugins
  type ActionRef = { id: string; actionName: string }
  const actionRefs: ActionRef[] = [];

  /**
   * This plugin sees a file with 'use server' and transforms it.
   * The transformed code is a client-side version which replaces the implementation with an API call to the actions endpoint on the server.
   */
  const transformRsfForClientPlugin: Plugin = {
    name: "vite-plugin-transform-rsf-for-client",
    enforce: "pre", // Run before other transformations
    transform(code: string, id: string) { // id is filepath
      if (isServerActionFile(id, code)) {
        const actionName = getActionName(id);
        console.log("Transforming file for client: ", actionName, id);

        // Store the action id for the second plugin
        actionRefs.push({ id, actionName });

        return transformRsfForClient({ code, actionName });
      }
      return;
    },
  };

  /**
   * This plugin loops through 'use server' files found earlier and registers them with the server.
   * When the client calls the action, the server can handle it and call the underlying function.
   */
  const registerRsfForServerPlugin: Plugin = {
    name: "vite-plugin-register-rsf-for-server",
    enforce: "post", // Run after all other transformations (including TypeScript)
    async buildStart() { // This runs after all transformations are complete
      for (const { id, actionName } of actionRefs) {
        try {
          // At this point, TypeScript has been transformed to JavaScript
          // We can now safely import the module
          const actionModule = await import(id + '?t=' + Date.now()); // Cache busting

          const actionFn = actionModule.default || actionModule[actionName];

          if (actionFn && typeof actionFn === 'function') {
            onServerActionFound({ actionName, actionFn });
            console.log(`Successfully loaded action function: ${actionName}`);
          } else {
            console.warn(`Action function not found in module ${id}: ${actionName}`);
          }
        } catch (error) {
          console.warn(`Failed to load transformed module ${id}:`, error);
        }
      }
    },
  };

  return [transformRsfForClientPlugin, registerRsfForServerPlugin];
};

