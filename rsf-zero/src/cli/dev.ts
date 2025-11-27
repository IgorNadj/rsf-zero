import type {Express} from "express";
import express from "express";
import morgan from "morgan";
import "dotenv/config";
import {startVite} from "./dev/startVite.ts";
import {Action} from "../types.ts";
import {createActionRoute} from "./start/createActionRoute.ts";
import {debug} from "../utils/debug.ts";
import {customRoutesHook} from "../utils/customRoutesHook.ts";
import {RsfZeroConfig} from "../utils/export-types.ts";
import {onStartHook} from "../utils/onStartHook.ts";
import {onBeforeStartHook} from "../utils/onBeforeStartHook.ts";

export const dev = async (options: RsfZeroConfig) => {
  const app: Express = express();
  const port = 3000;

  // onBeforeStart hook
  await onBeforeStartHook(options, app);

  app.use(morgan("dev"));

  app.use(express.json());

  // Dev RSF handler
  // - create action route
  const { add: addToActionRegistry } = createActionRoute(app);
  // - in dev mode, Vite loads files on the fly, so we need to register actions handlers on the fly too
  const onActionFound = async (action: Action) => {
    debug("Loading action handler: " + action.id);
    const module = await vite.ssrLoadModule(`${action.sourceFilePath}`);
    const actionFn = module[action.name];
    addToActionRegistry(action.id, actionFn );
    debug("Loaded action handler: " + action.name);
  }

  // - register custom routes
  await customRoutesHook(options, app);

  // Serve the frontend
  // - transform any actions found for the frontend
  // - and inform the onActionFound callback above
  const vite = await startVite({ app, onActionFound });

  // onStart hook
  await onStartHook(options, app);

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}
