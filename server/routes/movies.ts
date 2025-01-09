import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db";
import { movieActors, movies } from "../db/schema";
import {
  createMovieActorSchema,
  createMovieSchema,
  type Movie,
} from "../sharedTypes";

const routes = new Hono()
  .get("/", async (c) => {
    try {
      const allMovies = await db.query.movies.findMany({
        with: {
          producer: {
            columns: {
              id: true,
              name: true,
              gender: true,
              dateOfBirth: true,
              bio: true,
            },
          },
          movieActors: {
            with: {
              actor: {
                columns: {
                  id: true,
                  name: true,
                  gender: true,
                  dateOfBirth: true,
                  bio: true,
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
  })
  .post("/", zValidator("json", createMovieSchema), async (c) => {
    const { name, yearOfRelease, plot, poster, producerId, actorIds } =
      c.req.valid("json");

    try {
      const newMovie = await db.transaction(async (tx) => {
        const [newMovie] = await tx
          .insert(movies)
          .values({
            name,
            yearOfRelease,
            plot,
            poster,
            producerId,
          })
          .returning({ id: movies.id });

        const movieId = newMovie.id;

        const movieActorRelations = actorIds.map((actorId) =>
          createMovieActorSchema.parse({
            movieId,
            actorId,
          })
        );

        await tx.insert(movieActors).values(movieActorRelations);
        return newMovie;
      });
      return c.json({ data: newMovie, message: "success" }, 201);
    } catch (error: any) {
      const code: string = error["code"] ?? "";
      // Unique constraint:
      if (code === "23505") {
        return c.json({ data: null, message: "Movie already exists" }, 409);
      }
      return c.json({ data: null, message: "Failed to create a Movie" }, 500);
    }
  });

export const movieRoutes = routes;
