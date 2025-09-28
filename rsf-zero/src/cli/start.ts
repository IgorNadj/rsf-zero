import path from 'path';
import express from "express";
import morgan from "morgan";
import "dotenv/config";
import type { Express } from "express";
import {createActionRoute} from "./start/createActionRoute.ts";
import {ActionRegistry} from "../types.ts";
import {RsfZeroOptions} from "../export-types.ts";


export const start = async (options: RsfZeroOptions) => {
  const app: Express = express();
  const port = 3000;

  app.use(morgan("dev"));

  app.use(express.json());

  // Client
  const staticPath = path.join(process.cwd(), 'dist/client/');
  console.log('Serving static files from:', staticPath);
  app.use(express.static('dist/client/', options.startStatic ?? {}));

  // Server
  // - create action route
  const { set: setActionRegistry } = createActionRoute(app);
  // - load actionRegistry dynamically
  const module: { actionRegistry: ActionRegistry} = await import(path.join(process.cwd(), 'dist/server/actionRegistry.js'));
  const { actionRegistry } = module;
  // - register action handlers
  setActionRegistry(actionRegistry);

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

