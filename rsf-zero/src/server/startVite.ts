import { createServer as createViteServer } from "vite";
import fs from "fs";
import viteReact from "@vitejs/plugin-react";
import { transformRsfForClientVitePlugin } from "../transform/transformRsfForClientVitePlugin.ts";
import type { Express } from "express";
import type { RegisterServerAction } from "./actionHandler.ts";

export const startVite = async ({
  app,
  onServerActionFound,
}: {
  app: Express;
  onServerActionFound: RegisterServerAction;
}) => {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
    plugins: [viteReact(), transformRsfForClientVitePlugin(onServerActionFound)],
  });

  // Use vite's connect instance as middleware.
  // This will handle serving client-side assets and HMR.
  app.use(vite.middlewares);

  // All other routes should be handled by Vite
  // /{*splat} matches all routes including /
  app.get("/{*splat}", async (req, res) => {
    const templatePath = process.cwd() + "/public/index.html";

    // 1. Read index.html
    const template = fs.readFileSync(templatePath, "utf-8");

    // 2. Apply Vite HTML transforms.
    const html = await vite.transformIndexHtml(req.originalUrl, template);

    // 3. Send the rendered HTML back.
    res.status(200).set({ "Content-Type": "text/html" }).end(html);
  });
};
