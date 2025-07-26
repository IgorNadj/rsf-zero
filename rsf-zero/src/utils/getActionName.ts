import { basename } from "node:path";
import { extname } from "./extname.ts";

export const getActionName = (filePath: string) => {
  const fileName = basename(filePath);
  const ext = extname(fileName);
  return fileName.slice(0, fileName.length - ext.length);
};
