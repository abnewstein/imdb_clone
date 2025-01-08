import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db";
import { producers } from "../db/schema";
import { createProducerSchema, type Producer } from "../sharedTypes";

const routes = new Hono()
  .get("/", async (c) => {
    try {
      const allProducers: Producer[] = await db.select().from(producers);
      return c.json(allProducers, 200);
    } catch (error) {
      return c.json({ error: "Failed to fetch Producers" }, 500);
    }
  })
  .post("/", zValidator("json", createProducerSchema), async (c) => {
    const { name, gender, dateOfBirth, bio } = c.req.valid("json");
    try {
      const newProducer: Producer[] = await db
        .insert(producers)
        .values({
          name,
          gender,
          dateOfBirth,
          bio,
        })
        .returning();
      return c.json(newProducer, 201);
    } catch (error) {
      return c.json({ error: "Failed to create a Producer" }, 500);
    }
  });

export const producerRoutes = routes;
