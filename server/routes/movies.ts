import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db";
import { movieActors, movies } from "../db/schema";
import {
  createMovieActorSchema,
  createMovieSchema,
  type Movie,
} from "../sharedTypes";

const routes = new Hono().get("/", async (c) => {
  try {
    const allMovies = await db.query.movies.findMany({
      with: {
        producer: {
          columns: {
            id: true,
            name: true,
          },
        },
        movieActors: {
          with: {
            actor: {
              columns: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    const formattedMovies: Movie[] = allMovies.map((movie) => ({
      id: movie.id,
      name: movie.name,
      yearOfRelease: movie.yearOfRelease,
      plot: movie.plot ?? "",
      poster: movie.poster ?? "",
      producer: movie.producer,
      actors: movie.movieActors.map((ma) => ma.actor),
    }));

    return c.json(formattedMovies, 200);
  } catch (error) {
    console.error("Error fetching movies:", error);
    return c.json({ error: "Failed to fetch movies" }, 500);
  }
});

export const movieRoutes = routes;
