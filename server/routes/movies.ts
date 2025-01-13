import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db";
import { movieActors, movies } from "../db/schema";
import { eq } from "drizzle-orm";
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
    const { name, yearOfRelease, plot, producerId, actorIds } =
      c.req.valid("json");

    try {
      const newMovie = await db.transaction(async (tx) => {
        const [newMovie] = await tx
          .insert(movies)
          .values({
            name,
            yearOfRelease,
            plot,
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
  })
  .put("/:id", zValidator("json", createMovieSchema), async (c) => {
    const movieId = parseInt(c.req.param("id"));
    const { name, yearOfRelease, plot, producerId, actorIds } =
      c.req.valid("json");

    try {
      const existingMovie = await db.query.movies.findFirst({
        where: eq(movies.id, movieId),
        with: {
          movieActors: true,
        },
      });

      if (!existingMovie) {
        return c.json({ data: null, message: "Movie not found" }, 404);
      }

      // Compare the submitted data with the existing data
      const isSameData =
        existingMovie.name === name &&
        existingMovie.yearOfRelease === yearOfRelease &&
        existingMovie.plot === (plot ?? "") &&
        existingMovie.producerId === producerId &&
        existingMovie.movieActors
          .map((ma) => ma.actorId)
          .sort()
          .join(",") === actorIds.sort().join(",");

      if (isSameData) {
        return c.json({ data: null, message: "No changes detected" }, 400);
      }

      // Proceed with the update if there are changes
      const updatedMovie = await db.transaction(async (tx) => {
        const [movie] = await tx
          .update(movies)
          .set({
            name,
            yearOfRelease,
            plot,
            producerId,
          })
          .where(eq(movies.id, movieId))
          .returning();

        await tx.delete(movieActors).where(eq(movieActors.movieId, movieId));

        const movieActorRelations = actorIds.map((actorId) =>
          createMovieActorSchema.parse({
            movieId,
            actorId,
          })
        );
        await tx.insert(movieActors).values(movieActorRelations);

        return movie;
      });

      return c.json(
        { data: updatedMovie, message: "Movie updated successfully" },
        200
      );
    } catch (error) {
      console.error("Error updating movie:", error);
      return c.json({ data: null, message: "Failed to update movie" }, 500);
    }
  })
  .delete("/:id", async (c) => {
    const movieId = parseInt(c.req.param("id"));

    try {
      await db.transaction(async (tx) => {
        await tx.delete(movieActors).where(eq(movieActors.movieId, movieId));
        await tx.delete(movies).where(eq(movies.id, movieId));
      });

      return c.json({ data: null, message: "Movie deleted successfully" }, 200);
    } catch (error) {
      console.error("Error deleting movie:", error);
      return c.json({ data: null, message: "Failed to delete movie" }, 500);
    }
  });

export const movieRoutes = routes;
