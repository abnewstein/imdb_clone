import { z } from "zod";
import {
  insertActorSchema,
  selectActorSchema,
  insertProducerSchema,
  selectProducerSchema,
  insertMovieSchema,
  selectMovieSchema,
  insertMovieActorSchema,
  selectMovieActorSchema,
} from "./db/schema";

export const actorSchema = selectActorSchema.omit({ createdAt: true });
export const createActorSchema = insertActorSchema.omit({
  id: true,
  createdAt: true,
});
export const producerSchema = selectProducerSchema.omit({ createdAt: true });
export const createProducerSchema = insertProducerSchema.omit({
  id: true,
  createdAt: true,
});

export const movieSchema = selectMovieSchema.omit({ createdAt: true });
export const createMovieSchema = insertMovieSchema.omit({
  id: true,
  createdAt: true,
});

export const movieActorSchema = selectMovieActorSchema.omit({
  createdAt: true,
});
export const createMovieActorSchema = insertMovieActorSchema.omit({
  createdAt: true,
});

const movieType = z.object({
  id: z.number(),
  name: z.string(),
  yearOfRelease: z.number(),
  plot: z.string().optional(),
  poster: z.string().optional(),
  producer: z.object({
    id: z.number(),
    name: z.string(),
  }),
  actors: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
    })
  ),
});

export type Movie = z.infer<typeof movieType>;
export type Actor = z.infer<typeof actorSchema>;
export type Producer = z.infer<typeof producerSchema>;
