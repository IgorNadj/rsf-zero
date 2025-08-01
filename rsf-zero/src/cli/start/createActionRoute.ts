import type { Express } from "express";
import {parse, stringify} from "superjson";
import {Action, ActionRegistry} from "../../types.ts";
import {debug} from "../../utils/debug.ts";

type ReturnType = {
  add: (actionId: Action['id'], actionFn: CallableFunction) => void;
  set: (actionRegistry: ActionRegistry) => void;
}

export const createActionRoute = (app: Express): ReturnType => {
  let actionRegistry: ActionRegistry = {};

  const add = (actionId: Action['id'], actionFn: CallableFunction) => {
    debug("Registering server action: " + actionId);
    actionRegistry[actionId] = actionFn;
  }

  const set = (newActionRegistry: ActionRegistry) => {
    actionRegistry = newActionRegistry;
  }

  app.post("/actions/:actionId", async (req, res) => {
    const { actionId } = req.params;
    debug("Received request for action: ", actionId);

    const actionFn = actionRegistry[actionId];
    if (!actionFn) {
      throw new Error('Server does not have this action registered: ' + actionId);
    }

    debug("Request body: ", req.body);

    const serialisedFnArgs = req.body.serialisedFnArgs;
    const fnArgs = parse(serialisedFnArgs) as any[];

    // Call the action function
    debug("Request fn args: ", fnArgs);
    const actionFnReturnValue = await callActionFn(actionId, actionFn, fnArgs);

    // Serialise the result
    const serialisedFnResult = serialiseReturnValue(actionId, actionFnReturnValue);

    res.json({ serialisedFnResult });
  });

  return {
    add,
    set,
  };
};

const callActionFn = async (actionId: string, actionFn: CallableFunction, fnArgs: any[]): Promise<any> => {
  debug('Calling action: ' + actionId + ' with fn: '+ actionFn + ' with args: ', fnArgs);
  try {
    const actionFnReturnValue = await actionFn(...fnArgs);
    debug('Action ' + actionId + ' return value: ', actionFnReturnValue);
    return actionFnReturnValue;
  } catch (e) {
    throw new Error('Error thrown in action handler ' + actionId + ': ' + e)
  }
}

const serialiseReturnValue = (actionId: string, value: any): string => {
  try {
    const serialised = stringify(value);
    debug('Serialised action ' + actionId + ' return value: ', serialised);
    return serialised;

  } catch (e) {
    throw new Error('Error serialising ' + actionId + ' return value: ' + e)
  }
}
