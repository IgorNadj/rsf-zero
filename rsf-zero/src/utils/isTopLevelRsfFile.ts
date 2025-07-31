import { extname } from "./extname.ts";

export const isTopLevelRsfFile = (id: string, code: string) => {
  const ext = extname(id);
  if (ext === ".ts" || ext === ".tsx") {
    return code.startsWith(`'use server'`) || code.startsWith(`"use server"`);
  }
  return false;
};
