import { Hono } from "hono";
import { logger } from "hono/logger";
import { movieRoutes } from "./routes";

const app = new Hono();
app.use("*", logger());

app.get("/", (c) => c.text("Hono!"));
app.route("/api/movies", movieRoutes);
export default app;
