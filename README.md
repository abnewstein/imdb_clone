# imdb_clone

This project is a simplified clone of the Internet Movie Database (IMDb), providing functionalities to list movies, add new movies, and manage movie details. It comprises a backend built with BunJs and a frontend developed using React.

## Features

- Display a list of movies with details.
- Add new movies with associated actors and producers.
- Add new actors and producers
- Update existing movies
- Register / Login with token based authentication

## Tech stack

#### Backend

- BunJs (Node like Javascript runtime)
- Hono (Express like server)
- Drizzle ORM
- Zod validator
- JWT

#### Frontend

- Vite + React
- Tanstack Form and Query (for state management, forms, async api requests)
- TailwindCSS
- Shadcn UI components
- Zod validator

## Prerequisites

Before running this project, ensure you have the following installed:

- [BunJs](https://bun.sh)
- PostgreSQL database

## Installation

#### 1. Clone the repository:

```bash
git clone https://github.com/abnewstein/imdb_clone.git
cd imdb-clone
```

#### 2. Preparing the Backend

##### Configure the database:

- Ensure PostgreSQL is running on your machine.

- Create a database named imdb_clone.

- Set up environment variables for database connection in a .env file in the root directory:

```bash
DATABASE_URL=postgres://username:password@localhost:5432/imdb_clone
```

- Run database migrations to create all the necessary tables:

```bash
# In the root directory
bun run migrate
```

#### 3. Running the app

- Build the frontend app (backend will take from the dist folder of frontend app):

```bash
# In the frontend directory
cd frontend
bun install
bun run build

# in case you want a dev server for frontend, run
bun run dev
# The frontend application should now be accessible at http://localhost:5173.
```

- Start the backend server:

```bash
# In the root directory
bun install
bun run dev

# The backend server should now be running on http://localhost:3000.
```

- You can now access the app from http://localhost:3000

## Database Schema

The database consists of the following tables:

    movies:
        id (Primary Key)
        name (String, required)
        year_of_release (Integer, required)
        plot (Text, optional)
        producer_id (Foreign Key referencing producers.id)

    actors:
        id (Primary Key)
        name (String, required)
        gender (String, optional)
        date_of_birth (Date, optional)
        bio (Text, optional)

    producers:
        id (Primary Key)
        name (String, required)
        gender (String, optional)
        date_of_birth (Date, optional)
        bio (Text, optional)

    movie_actors:
        movie_id (Foreign Key referencing movies.id)
        actor_id (Foreign Key referencing actors.id)

## Form Validations

Form validations are implemented to ensure data integrity and provide a better user experience:

    Movie Form:
        name: Must be a non-empty string.
        year_of_release: Must be a valid four-digit year.
        plot: Optional; if provided, must be a string.
        producer_id: Must correspond to an existing producer in the database.
        actor_ids: Must be an array of valid actor IDs in the database.

    Actor / Producer Form:
        name: Must be a non-empty string; max 100 chars.
        date_of_birth: Must be a string with the format YYYY-MM-DD
        gender: Must be one of three strings "male", "female" or "other".
        bio: Optional; if provided, must be a string.

These validations are enforced both on the client side (frontend) and the server side (backend) to prevent invalid data submissions.

##
