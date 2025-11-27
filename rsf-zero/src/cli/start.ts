import path from 'path';
import type {Express} from "express";
import express from "express";
import morgan from "morgan";
import "dotenv/config";
import {createActionRoute} from "./start/createActionRoute.ts";
import {ActionRegistry} from "../types.ts";
import {RsfZeroConfig} from "../utils/export-types.ts";
import {debug} from "../utils/debug.ts";
import {customRoutesHook} from "../utils/customRoutesHook.ts";
import {onStartHook} from "../utils/onStartHook.ts";


export const start = async (options: RsfZeroConfig) => {
  const app: Express = express();
  const port = 3000;

  app.use(morgan("dev"));

  app.use(express.json());

  // Server
  // - create action route
  const { set: setActionRegistry } = createActionRoute(app);
  // - load actionRegistry dynamically
  const module: { actionRegistry: ActionRegistry} = await import(path.join(process.cwd(), 'dist/server/actionRegistry.ts'));
  const { actionRegistry } = module;
  // - register action handlers
  setActionRegistry(actionRegistry);
  // - register custom routes
  await customRoutesHook(options, app);

  // Client
  const staticPath = path.join(process.cwd(), 'dist/client/');
  debug('Serving static files from: ' + staticPath);
  app.use(express.static('dist/client/', options.startStatic ?? {}));
  // catch-all rule for SPAs with routing
  app.use((req, res) => {
    if (req.method === 'GET') {
      debug('Hit fallback path: ' + req.path);
      res.sendFile(path.join(process.cwd(), 'dist/client/index.html'));
    }
  })

  await onStartHook(options, app);

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

