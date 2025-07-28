import type { Express } from "express";
import {parse, stringify} from "superjson";
import {ActionHandler, ActionRegistry} from "../types.ts";
import {debug} from "./debug.ts";

type ReturnType = {
  add: (actionHandler: ActionHandler) => void;
  set: (actionRegistry: ActionRegistry) => void;
}

export const createActionRoute = (app: Express): ReturnType => {
  let actionRegistry: Record<ActionHandler['actionName'], ActionHandler['actionFn']> = {};

  const add = (actionHandler: ActionHandler) => {
    debug("Registering server action: ", actionHandler.actionName);
    actionRegistry[actionHandler.actionName] = actionHandler.actionFn;
  }

  const set = (newActionRegistry: ActionRegistry) => {
    actionRegistry = newActionRegistry;
  }

  app.post("/actions/:actionName", async (req, res) => {
    const actionName = req.params.actionName;
    debug("Received request for action: ", actionName);

    const actionFn = actionRegistry[actionName];
    if (!actionFn) {
      throw new Error('No action handler found for action: ' + actionName);
    }

    debug("Request body: ", req.body);

    const serialisedFnArgs = req.body.serialisedFnArgs;
    const fnArgs = parse(serialisedFnArgs) as any[];

    // Call the action function
    debug("Request fn args: ", fnArgs);
    const result = await callActionFn(actionName, actionFn, fnArgs);

    // Serialise the result
    const serialisedFnResult = serialiseReturnValue(actionName, result);

    res.json({ serialisedFnResult });
  });

  return {
    add,
    set,
  };
};

const callActionFn = async (actionName: string, actionFn: CallableFunction, fnArgs: any[]): Promise<any> => {
  debug("Calling action: ", actionName, fnArgs);
  try {
    const result = await actionFn(...fnArgs);
    debug("Result: ", result);
    return result;
  } catch (e) {
    throw new Error('Error thrown in action handler ' + actionName + ': ' + e)
  }
}

const serialiseReturnValue = (actionName: string, value: any): string => {
  try {
    const serialised = stringify(value);
    debug("serialisedFnResult: ", serialised);
    return serialised;

  } catch (e) {
    throw new Error('Error serialising ' + actionName + ' action result ' + e)
  }
}
