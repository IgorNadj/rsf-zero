/**
 * Given a file that starts with 'use server', return a transformed client version of that file.
 */
export const transformTopLevelRsf =
  (
    actionName: string,
  ) => {
    return `
import { createActionCaller } from "rsf-zero/client";
export const ${actionName} = createActionCaller('${actionName}');
`;
};
