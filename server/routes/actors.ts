import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db";
import { actors } from "../db/schema";
import { createActorSchema, type Actor } from "../sharedTypes";

const routes = new Hono()
  .get("/", async (c) => {
    try {
      const allActors: Actor[] = await db.select().from(actors);
      return c.json(allActors, 200);
    } catch (error) {
      return c.json({ error: "Failed to fetch Actors" }, 500);
    }
  })
  .post("/", zValidator("json", createActorSchema), async (c) => {
    const { name, gender, dateOfBirth, bio } = c.req.valid("json");
    try {
      const newActor: Actor[] = await db
        .insert(actors)
        .values({
          name,
          gender,
          dateOfBirth,
          bio,
        })
        .returning();
      return c.json(newActor, 201);
    } catch (error) {
      return c.json({ error: "Failed to create a Producer" }, 500);
    }
  });

export const actorRoutes = routes;
