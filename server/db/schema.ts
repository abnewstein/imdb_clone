import {
  pgTable,
  serial,
  integer,
  varchar,
  date,
  text,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { z } from "zod";

const commonFields = {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
};

export const actors = pgTable("actors", {
  ...commonFields,
  gender: varchar("gender", { length: 10 }).notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  bio: text("bio"),
});

export const producers = pgTable("producers", {
  ...commonFields,
  gender: varchar("gender", { length: 10 }).notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  bio: text("bio"),
});

export const movies = pgTable("movies", {
  ...commonFields,
  yearOfRelease: integer("year_of_release").notNull(),
  plot: text("plot"),
  poster: text("poster"),
  producerId: integer("producer_id")
    .references(() => producers.id)
    .notNull(),
});

export const movieActors = pgTable(
  "movie_actors",
  {
    movieId: integer("movie_id")
      .references(() => movies.id)
      .notNull(),
    actorId: integer("actor_id")
      .references(() => actors.id)
      .notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.movieId, table.actorId] })]
);

// Relations
export const moviesRelations = relations(movies, ({ one, many }) => ({
  producer: one(producers, {
    fields: [movies.producerId],
    references: [producers.id],
  }),
  movieActors: many(movieActors),
}));

export const actorsRelations = relations(actors, ({ many }) => ({
  movieActors: many(movieActors),
}));

export const producersRelations = relations(producers, ({ many }) => ({
  movies: many(movies),
}));

export const movieActorsRelations = relations(movieActors, ({ one }) => ({
  movie: one(movies, {
    fields: [movieActors.movieId],
    references: [movies.id],
  }),
  actor: one(actors, {
    fields: [movieActors.actorId],
    references: [actors.id],
  }),
}));

// zod schemas for validation
export const insertActorSchema = createInsertSchema(actors, {
  name: z.string().min(1).max(100),
  gender: z.string().min(1).max(10),
  dateOfBirth: z.string().date(),
});
export const selectActorSchema = createSelectSchema(actors);

export const insertProducerSchema = createInsertSchema(producers, {
  name: z.string().min(1).max(100),
  gender: z.string().min(1).max(10),
  dateOfBirth: z.string().date(),
});
export const selectProducerSchema = createSelectSchema(producers);

export const insertMovieSchema = createInsertSchema(movies, {
  name: z.string().min(1).max(100),
  yearOfRelease: z.number().positive().gte(1900).lt(2100),
});
export const selectMovieSchema = createSelectSchema(movies);

export const insertMovieActorSchema = createInsertSchema(movieActors);
export const selectMovieActorSchema = createSelectSchema(movieActors);
