import { Hono } from "hono";
import { getMovies, createMovie } from "../controllers/movies";

const routes = new Hono();

routes.get("/", getMovies);
routes.post("/", createMovie);

export const movieRoutes = routes;
