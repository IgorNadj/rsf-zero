import { stringify, parse } from 'superjson';

export const createActionCaller = (actionName: string) => {
  return async (...args: any[]) => {
    try {
      console.debug("caller called with args: " + args);
      const result = await fetch("/actions/" + actionName, {
        method: "POST",
        body: JSON.stringify( { serialisedFnArgs: stringify(args) }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const parsedResult = await result.json();
      const deserialisedFnResult = parse(parsedResult.serialisedFnResult);
      console.debug("deserialisedFnResult: ", deserialisedFnResult);
      return deserialisedFnResult;
    } catch (e) {
      throw new Error('Error calling action ' + actionName + ': ' + e)
    }
  };
};
