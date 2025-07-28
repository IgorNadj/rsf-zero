import * as swc from "@swc/core";
import { collectExportNames } from "./collectExportNames.ts";

export const getActionName = (filePath: string, code: string) => {
  const module = swc.parseSync(code);

  const exportNames = collectExportNames(module);
  if (exportNames.size < 1) throw new Error(`No exports found in ${filePath}, 1 required`);
  if (exportNames.size > 1) throw new Error(`More than 1 export found in ${filePath}, exactly 1 required`);

  const [firstExportName] = exportNames;
  return firstExportName;
};


