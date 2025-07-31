import type { Plugin } from "vite";
import { isTopLevelRsfFile } from "../utils/isTopLevelRsfFile.ts";
import { getActionName } from "../utils/getActionName.ts";
import {Action} from "../types.ts";
import {debug} from "../utils/debug.ts";


/**
 * This plugin sees a file with 'use server' and transforms it to a client-side version.
 *
 * The client-side version has the original code replaced with an API call to the server for that action.
 *
 * This plugin also registers all actions found via the passed onActionFound function.
 */
export const transformRsfForClientPlugin = (onActionFound: (action: Action) => void) : Plugin => {
  return {
    name: "vite-plugin-transform-rsf-for-client",
    transform(code, id, options) { // id is filepath
      if (options?.ssr) {
        // plugin is running in the 'dev' command, and loading the module for the server
        return;
      }
      if (isServerActionFile(id, code)) {
        const actionName = getActionName(id, code);
        debug("Transforming file for client: ", actionName, id);
        onActionFound({
          sourceFilePath: id,
          name: actionName,
        });
        return transform(actionName);
      }
      return;
    },
  };
}

const transform =
  (
    actionName: string,
  ) => {
  return `
import { createActionCaller } from "rsf-zero/client";
export const ${actionName} = createActionCaller('${actionName}');
`;
};
