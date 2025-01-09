import { z } from "zod";
import { createMovieSchema } from "@server/sharedTypes";

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
