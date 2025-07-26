import express from "express";
import morgan from "morgan";
import "dotenv/config";
import { startVite } from "./startVite.ts";
import type { Express } from "express";

export const startDev = async () => {
  const app: Express = express();
  const port = 3000;

  app.use(morgan("dev"));

  app.use(express.json());

    // 'rsf-zero dev' called, compile without outputting to dist, and use HMR

    // RSF handler
    // const onServerActionFound = actionHandler(app);
  // FIXME: reimplement

    // startVite serves the frontend + transforms RSF and lets us know it did so
    await startVite({app});


  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
