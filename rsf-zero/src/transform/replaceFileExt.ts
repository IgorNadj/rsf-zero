import {extname} from "./extname.ts";


export const replaceFileExt = (path: string, newExt: string) => {
  const originalExt = extname(path);
  return path.slice(0, -originalExt.length) + newExt;
}
