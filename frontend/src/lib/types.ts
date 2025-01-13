import { z } from "zod";
import {
  createMovieSchema,
  createActorSchema,
  createProducerSchema,
  createUserSchema,
} from "@server/sharedTypes";

export const addMovieSchema = createMovieSchema.extend({
  yearOfRelease: z
    .string()
    .regex(/^\d{4}$/, { message: "Year of release must be a 4 digit number" })
    .refine(
      (value) => {
        const year = parseInt(value);
        return year >= 1900 && year < 2100;
      },
      { message: "Year of release must be between 1900 and 2099" }
    ),
  producerId: z.string().regex(/^\d+$/, { message: "Producer is required" }),
  actorIds: z
    .array(
      z.object({
        id: z.string().regex(/^\d+$/, { message: "Actor is required" }),
      })
    )
    .nonempty({ message: "At least one actor is required" }),
});

export type AddMoviePayload = z.infer<typeof addMovieSchema>;
export type CreateActorPayload = z.infer<typeof createActorSchema>;
export type CreateProducerPayload = z.infer<typeof createProducerSchema>;
export type AddUserPayload = z.infer<typeof createUserSchema>;
