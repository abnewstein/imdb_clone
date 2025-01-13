import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";
import { HTTPException } from "hono/http-exception";
import { type Variables as AppEnvVariables, envVariables } from "../factory";
import { z } from "zod";

export const jwtPayloadSchema = z.object({
  sub: z.string(),
  exp: z.number().refine((val) => val > Date.now() / 1000, {
    message: "expired",
  }),
  iat: z.number(),
});

export type JwtPayload = z.infer<typeof jwtPayloadSchema>;
export type Variables = AppEnvVariables & {
  jwtPayload: JwtPayload;
};

export function auth() {
  return createMiddleware<{ Variables: Variables }>(async (c, next) => {
    const jwtToken = c.req
      .header("authorization")
      ?.replace("Bearer ", "") as string;

    let jwtPayload: JwtPayload;
    try {
      jwtPayload = jwtPayloadSchema.parse(
        await verify(jwtToken, envVariables.JWT_SECRET)
      );
    } catch (error) {
      console.error(error);
      throw new HTTPException(401, {
        res: Response.json({ error: "Unauthorized" }, { status: 401 }),
      });
    }

    const currentTime = Math.floor(Date.now() / 1000);
    if (jwtPayload.exp < currentTime) {
      throw new HTTPException(401, {
        res: Response.json({ error: "Token expired" }, { status: 401 }),
      });
    }

    c.set("jwtPayload", jwtPayload);
    await next();
  });
}
