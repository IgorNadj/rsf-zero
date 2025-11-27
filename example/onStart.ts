import type {Express} from "express";

export const onStart = (app: Express) => {
  console.log('onStart');
}
