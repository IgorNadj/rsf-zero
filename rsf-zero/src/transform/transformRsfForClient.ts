import * as swc from "@swc/core";
import { collectExportNames } from "../utils/collectExportNames.ts";

export const transformRsfForClient = ({
  code,
  actionName,
}: {
  code: string;
  actionName: string;
}) => {
  const mod = swc.parseSync(code);
  const exportNames = collectExportNames(mod);
  const [firstExportName] = exportNames;
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

export const ${firstExportName} = createActionCaller('${actionName}');
`;
  return swc.transformSync(newCode, {
    jsc: { target: "esnext" },
    sourceMaps: true,
  });
};
