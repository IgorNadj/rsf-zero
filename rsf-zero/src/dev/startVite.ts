import { createServer as createViteServer } from "vite";
import fs from "fs";
import viteReact from "@vitejs/plugin-react";
import type { Express } from "express";
import {transformRsfForClientPlugin} from "../transform/transformRsfForClientPlugin.ts";
import {Action} from "../types.ts";
import {debug} from "../utils/debug.ts";

export const startVite = async ({
  app,
  onActionFound
}: {
  app: Express;
  onActionFound: (action: Action) => void;
}) => {
  debug('starting dev vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
    base: '/',
    plugins: [
      viteReact(),
      transformRsfForClientPlugin(onActionFound),
    ],
  });

  // Use vite's connect instance as middleware.
  // This will handle serving client-side assets and HMR.
  app.use(vite.middlewares);

  // All other routes should be handled by Vite
  // /{*splat} matches all routes including /
  app.get("/{*splat}", async (req, res) => {
    const templatePath = process.cwd() + "/index.html";

    // 1. Read index.html
    const template = fs.readFileSync(templatePath, "utf-8");

    // 2. Apply Vite HTML transforms.
    const html = await vite.transformIndexHtml(req.originalUrl, template);

    // 3. Send the rendered HTML back.
    res.status(200).set({ "Content-Type": "text/html" }).end(html);
  });

  return vite;
};
