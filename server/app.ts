import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";
import { actorRoutes, producerRoutes } from "./routes";

const app = new Hono();
app.use("*", logger());

const apiRoutes = app
  .basePath("/api")
  .route("/actors", actorRoutes)
  .route("/producers", producerRoutes);

app.get("*", serveStatic({ root: "./frontend/dist" }));
app.get("*", serveStatic({ path: "./frontend/dist/index.html" }));

export default app;
export type ApiRoutes = typeof apiRoutes;
