import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { actors, producers, movies, movieActors } from "./db/schema";

export type Gender = "male" | "female" | "other";

export const insertActorSchema = createInsertSchema(actors, {
  name: z
    .string()
    .min(1, { message: "Actor name must at least be 1 character" })
    .max(100, { message: "Actor name must be at most 100 characters" }),
  gender: z.string().refine(
    (value) => {
      return value === "male" || value === "female" || value === "other";
    },
    {
      message: "Gender must be one of male, female or other",
    }
  ),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Date of birth must be in the format YYYY-MM-DD",
  }),
});
export const selectActorSchema = createSelectSchema(actors);

export const insertProducerSchema = createInsertSchema(producers, {
  name: z
    .string()
    .min(1, { message: "Producer name must at least be 1 character" })
    .max(100, { message: "Producer name must be at most 100 characters" }),
  gender: z.string().refine(
    (value) => {
      return value === "male" || value === "female" || value === "other";
    },
    {
      message: "Gender must be one of male, female or other",
    }
  ),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Date of birth must be in the format YYYY-MM-DD",
  }),
});
export const selectProducerSchema = createSelectSchema(producers);

export const insertMovieSchema = createInsertSchema(movies, {
  name: z
    .string()
    .min(1, { message: "Movie name must at least be 1 character" })
    .max(100, { message: "Movie name must be at most 100 characters" }),
  yearOfRelease: z
    .number()
    .positive()
    .gte(1900, {
      message: "Year of release must be greater than or equal to 1900",
    })
    .lt(2100, { message: "Year of release must be less than 2100" }),
  plot: z
    .string()
    .max(3000, { message: "Plot must be less than 3000 characters" })
    .optional(),
  producerId: z.number().positive(),
});
export const selectMovieSchema = createSelectSchema(movies);

export const insertMovieActorSchema = createInsertSchema(movieActors);
export const selectMovieActorSchema = createSelectSchema(movieActors);

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
export const createMovieSchema = insertMovieSchema
  .omit({
    id: true,
    createdAt: true,
  })
  .extend({
    actorIds: z.array(z.number().positive()),
  });

export const movieActorSchema = selectMovieActorSchema.omit({
  createdAt: true,
});
export const createMovieActorSchema = insertMovieActorSchema.omit({
  createdAt: true,
});

const movieType = movieSchema
  .omit({
    producerId: true,
  })
  .extend({
    producer: producerSchema,
    actors: z.array(actorSchema),
  });

export type Movie = z.infer<typeof movieType>;
export type CreateMovie = z.infer<typeof createMovieSchema>;
export type Actor = z.infer<typeof actorSchema>;
export type Producer = z.infer<typeof producerSchema>;
