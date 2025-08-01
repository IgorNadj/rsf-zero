import md5 from "md5";
import path from "path";


export const getActionId = (sourceFilePath: string, actionName: string) => {
  const absolutePath = path.resolve(sourceFilePath);
  const hash = md5(absolutePath);
  return `${actionName}_${hash}`;
}
