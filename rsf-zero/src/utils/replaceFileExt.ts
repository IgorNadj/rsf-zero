import {extname} from "./extname.js";


export const replaceFileExt = (path: string, newExt: string) => {
  const originalExt = extname(path);
  return path.slice(0, -originalExt.length) + newExt;
}
