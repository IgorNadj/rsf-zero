import type {Express} from "express";

export const onBeforeStart = (app: Express) => {
  console.log('onBeforeStart');
}
