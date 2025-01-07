import {
  pgTable,
  serial,
  integer,
  varchar,
  date,
  text,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const actors = pgTable("actors", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  gender: varchar("gender", { length: 10 }).notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  bio: text("bio"),
});

export const producers = pgTable("producers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  gender: varchar("gender", { length: 10 }).notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  bio: text("bio"),
});

export const movies = pgTable("movies", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
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
    role: varchar("role", { length: 255 }),
  },
  (table) => [primaryKey({ columns: [table.movieId, table.actorId] })]
);

// Relations
export const moviesRelations = relations(movies, ({ one, many }) => ({
  producer: one(producers, {
    fields: [movies.producerId],
    references: [producers.id],
  }),
  actors: many(movieActors),
}));

export const actorsRelations = relations(actors, ({ many }) => ({
  movies: many(movieActors),
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
