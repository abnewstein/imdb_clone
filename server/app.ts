import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";
import { actorRoutes, producerRoutes, movieRoutes } from "./routes";
import { authRoutes } from "./routes/auth";
import { factory } from "./factory";
import { auth } from "./middleware/auth";
import { showRoutes } from "hono/dev";

const app = factory.createApp();
app.use("*", logger());
const authRoute = app.basePath("/").route("/auth", authRoutes);
// app.use("/api/*", auth());

const apiRoutes = app
  .basePath("/api")
  .route("/actors", actorRoutes)
  .route("/producers", producerRoutes)
  .route("/movies", movieRoutes);

app.get("*", serveStatic({ root: "./frontend/dist" }));
app.get("*", serveStatic({ path: "./frontend/dist/index.html" }));
showRoutes(app);
export default app;
export type ApiRoutes = typeof apiRoutes;
export type AuthRoute = typeof authRoute;
