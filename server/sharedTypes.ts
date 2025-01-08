import { z } from "zod";
import {
  insertActorSchema,
  selectActorSchema,
  insertProducerSchema,
  selectProducerSchema,
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

export type Actor = z.infer<typeof actorSchema>;
export type Producer = z.infer<typeof producerSchema>;
