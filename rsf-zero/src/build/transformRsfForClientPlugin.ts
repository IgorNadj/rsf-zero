import * as swc from "@swc/core";
import type { Plugin } from "vite";
import { isServerActionFile } from "../utils/isServerActionFile.ts";
import { getActionName } from "../utils/getActionName.ts";
import {Action} from "../types.js";


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
    transform(code: string, id: string) { // id is filepath
      if (isServerActionFile(id, code)) {
        const actionName = getActionName(id, code);
        console.log("Transforming file for client: ", actionName, id);
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
  let newCode = `
import { stringify, parse } from 'superjson';  
  
const createActionCaller = (actionName) => {
  return async (...args) => {
    try {
      console.log("caller called with args: " + args);
      const result = await fetch("/actions/" + actionName, {
        method: "POST",
        body: JSON.stringify( { serialisedFnArgs: stringify(args) }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const parsedResult = await result.json();
      const deserialisedFnResult = parse(parsedResult.serialisedFnResult);
      console.log("deserialisedFnResult: ", deserialisedFnResult);
      return deserialisedFnResult;
    } catch (e) {
      console.error("Error calling action: ", actionName, e);
      throw e;
    }
  };
};

export const ${actionName} = createActionCaller('${actionName}');
`;
  return swc.transformSync(newCode, {
    jsc: { target: "esnext" },
    sourceMaps: true,
  });
};
