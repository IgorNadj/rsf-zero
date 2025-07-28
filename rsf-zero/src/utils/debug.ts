import {debuglog} from "node:util";


const log = debuglog('rsf-zero');

export const debug = (message: string, ...param: any[]) => {
  log(message, ...param);
};
