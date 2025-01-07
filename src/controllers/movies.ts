import type { Context } from "hono";
import { db } from "../db";
import { movies } from "../db/schema";

export const getMovies = async (c: Context) => {
  try {
    const allMovies = await db.select().from(movies);
    return c.json(allMovies);
  } catch (error) {
    return c.json({ error: "Failed to fetch movies" }, 500);
  }
};

export const createMovie = async (c: Context) => {
  const { title, yearOfRelease, producerId } = await c.req.json();
  try {
    const newMovie = await db
      .insert(movies)
      .values({
        title,
        yearOfRelease,
        producerId,
      })
      .returning();
    return c.json(newMovie, 201);
  } catch (error) {
    return c.json({ error: "Failed to create movie" }, 500);
  }
};
