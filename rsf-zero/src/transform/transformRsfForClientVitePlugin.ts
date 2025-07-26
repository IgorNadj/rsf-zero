import type { Plugin } from "vite";
import { transformRsfForClient } from "./transformRsfForClient.ts";
import { isServerActionFile } from "../utils/isServerActionFile.ts";
import { getActionName } from "../utils/getActionName.ts";

/**
 * This plugin sees a file with 'use server' and transforms it to a client-side version which calls the server.
 */
export const transformRsfForClientVitePlugin: Plugin = {
  name: "vite-plugin-transform-rsf-for-client",
  enforce: "pre", // Run before other transformations
  transform(code: string, id: string) { // id is filepath
    if (isServerActionFile(id, code)) {
      const actionName = getActionName(id);
      console.log("Transforming file for client: ", actionName, id);

      return transformRsfForClient({ code, actionName });
    }
    return;
  },
};
