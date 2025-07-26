import type { Express } from "express";
import { parse, stringify } from "superjson";

export type RegisterServerAction = ({
  actionName,
  actionFn,
}: {
  actionName: string;
  actionFn: CallableFunction;
}) => void;

export const actionHandler = (app: Express): RegisterServerAction => {
  return ({ actionName, actionFn }) => {
    console.log("Registering server action: ", actionName);

    app.post("/actions/" + actionName, async (req, res) => {
      console.log("Received request for action: ", actionName);
      console.log("Request body: ", req.body);

      const serialisedFnArgs = req.body.serialisedFnArgs;
      const fnArgs = parse(serialisedFnArgs) as any[];

      console.log("Request fn args: ", fnArgs);

      // Call the action
      const result = await actionFn(...fnArgs);
      console.log("Result: ", result);

      const serialisedFnResult = stringify(result);
      res.json({ serialisedFnResult });
    });
  };
};
