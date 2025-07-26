import type { Plugin } from "vite";



/**
 * This plugin sees a file with 'use server' and registers it with the server, so that when the client calls it, the
 * server handles it
 */
export const registerRsfForServerVitePlugin: Plugin = {
  name: "vite-plugin-register-rsf-for-server",
  enforce: "post", // Run after all other transformations (including TypeScript)
  async buildStart() {
    // This runs after all transformations are complete
    for (const [id, actionName] of serverActions.entries()) {
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

return [transformPlugin, moduleLoaderPlugin];
};
