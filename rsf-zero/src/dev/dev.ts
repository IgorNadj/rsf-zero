import express from "express";
import morgan from "morgan";
import "dotenv/config";
import { startVite } from "./startVite.ts";
import type { Express } from "express";
import {Action} from "../types.ts";
import {createActionRoute} from "../utils/createActionRoute.ts";
import {debug} from "../utils/debug.ts";

export const dev = async () => {
  const app: Express = express();
  const port = 3000;

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

  // Serve the frontend
  // - transform any actions found for the frontend
  // - and inform the onActionFound callback above
  const vite = await startVite({ app, onActionFound });

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}
