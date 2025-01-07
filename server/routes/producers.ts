import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db";
import { producers } from "../db/schema";

const createProducerSchema = z.object({
  name: z.string().nonempty(),
  gender: z.string().nonempty(),
  dateOfBirth: z.string().nonempty(),
  bio: z.string().optional(),
});

const routes = new Hono()
  .get("/", async (c) => {
    try {
      const allProducers = await db.select().from(producers);
      return c.json(allProducers);
    } catch (error) {
      return c.json({ error: "Failed to fetch Producers" }, 500);
    }
  })
  .post("/", zValidator("json", createProducerSchema), async (c) => {
    const { name, gender, dateOfBirth, bio } = c.req.valid("json");
    try {
      const newProducer = await db
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
