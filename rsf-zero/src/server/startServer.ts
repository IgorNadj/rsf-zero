import express from "express";
import morgan from "morgan";
import "dotenv/config";
import { actionHandler } from "./actionHandler.ts";
import { startVite } from "./startVite.ts";
import type { Express } from "express";


export const startServer = async () => {
  const app: Express = express();
  const port = 3000;

  app.use(morgan("dev"));

  app.use(express.json());

  // RSF handler
  const onServerActionFound = actionHandler(app);

  // startVite serves the frontend + transforms RSF and lets us know it did so
  await startVite({app, onServerActionFound});

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
