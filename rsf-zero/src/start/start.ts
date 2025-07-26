import path from 'path';
import express from "express";
import morgan from "morgan";
import "dotenv/config";
import type { Express } from "express";
import {actionHandler} from "./actionHandler.js";
import {ActionRegistry} from "../types.js";


export const start = async () => {
  const app: Express = express();
  const port = 3000;

  app.use(morgan("dev"));

  app.use(express.json());

  console.log('process.cwd()', process.cwd());

  // Client
  const staticPath = path.join(process.cwd(), 'dist/client/');
  console.log('Serving static files from:', staticPath);
  app.use(express.static('dist/client/'));

  // Server

  // load actionRegistry dynamically

  const module: { actionRegistry: ActionRegistry} = await import(path.join(process.cwd(), 'dist/server/generated/registry.js'));
  const { actionRegistry } = module;
  console.log('actionRegistry', actionRegistry);

  // register actions as routes
  const handle = actionHandler(app);
  console.log('Registering server actions', Object.keys(actionRegistry));
  for (const [actionName, actionFn] of Object.entries(actionRegistry)) {
    handle({
      actionName,
      actionFn,
    })
  }

  app.listen(port, () => {
    console.log(`Server is running on portt ${port}`);
  });
}

