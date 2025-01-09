import {
  pgTable,
  serial,
  integer,
  varchar,
  date,
  text,
  timestamp,
  primaryKey,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

const commonFields = {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
};

export const actors = pgTable(
  "actors",
  {
    ...commonFields,
    name: varchar("name", { length: 255 }).notNull(),
    gender: varchar("gender", { length: 10 }).notNull(),
    dateOfBirth: date("date_of_birth").notNull(),
    bio: text("bio"),
  },
  (table) => [unique().on(table.name, table.gender, table.dateOfBirth)]
);

export const producers = pgTable(
  "producers",
  {
    ...commonFields,
    name: varchar("name", { length: 255 }).notNull(),
    gender: varchar("gender", { length: 10 }).notNull(),
    dateOfBirth: date("date_of_birth").notNull(),
    bio: text("bio"),
  },
  (table) => [unique().on(table.name, table.gender, table.dateOfBirth)]
);

export const movies = pgTable(
  "movies",
  {
    ...commonFields,
    name: varchar("name", { length: 255 }).notNull(),
    yearOfRelease: integer("year_of_release").notNull(),
    plot: text("plot"),
    poster: text("poster"),
    producerId: integer("producer_id")
      .references(() => producers.id)
      .notNull(),
  },
  (table) => [unique().on(table.name, table.yearOfRelease, table.producerId)]
);

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
