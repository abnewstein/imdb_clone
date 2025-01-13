CREATE TABLE "actors" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"name" varchar(255) NOT NULL,
	"gender" varchar(10) NOT NULL,
	"date_of_birth" date NOT NULL,
	"bio" text,
	CONSTRAINT "actors_name_gender_date_of_birth_unique" UNIQUE("name","gender","date_of_birth")
);
--> statement-breakpoint
CREATE TABLE "movie_actors" (
	"movie_id" integer NOT NULL,
	"actor_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "movie_actors_movie_id_actor_id_pk" PRIMARY KEY("movie_id","actor_id")
);
--> statement-breakpoint
CREATE TABLE "movies" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"name" varchar(255) NOT NULL,
	"year_of_release" integer NOT NULL,
	"plot" text,
	"producer_id" integer NOT NULL,
	CONSTRAINT "movies_name_year_of_release_producer_id_unique" UNIQUE("name","year_of_release","producer_id")
);
--> statement-breakpoint
CREATE TABLE "producers" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"name" varchar(255) NOT NULL,
	"gender" varchar(10) NOT NULL,
	"date_of_birth" date NOT NULL,
	"bio" text,
	CONSTRAINT "producers_name_gender_date_of_birth_unique" UNIQUE("name","gender","date_of_birth")
);
--> statement-breakpoint
ALTER TABLE "movie_actors" ADD CONSTRAINT "movie_actors_movie_id_movies_id_fk" FOREIGN KEY ("movie_id") REFERENCES "public"."movies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movie_actors" ADD CONSTRAINT "movie_actors_actor_id_actors_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."actors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movies" ADD CONSTRAINT "movies_producer_id_producers_id_fk" FOREIGN KEY ("producer_id") REFERENCES "public"."producers"("id") ON DELETE no action ON UPDATE no action;