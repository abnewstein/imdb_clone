import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db";
import { users } from "../db/schema";
import { createUserSchema } from "../sharedTypes";

const routes = new Hono()
  .post("/register", zValidator("json", createUserSchema), async (c) => {
    const { username, password } = c.req.valid("json");

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [newUser] = await db
        .insert(users)
        .values({
          username,
          password: hashedPassword,
        })
        .returning({ id: users.id, username: users.username });

      const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET!, {
        expiresIn: "1h",
      });

      return c.json(
        {
          data: { ...newUser, token },
          message: "User registered successfully",
        },
        201
      );
    } catch (error: any) {
      const code: string = error["code"] ?? "";
      if (code === "23505") {
        return c.json({ data: null, message: "Username already exists" }, 409);
      }
      return c.json({ data: null, message: "Failed to register user" }, 500);
    }
  })
  .post("/login", zValidator("json", createUserSchema), async (c) => {
    const { username, password } = c.req.valid("json");

    try {
      const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.username, username),
      });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return c.json({ data: null, message: "Invalid credentials" }, 401);
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
        expiresIn: "1h",
      });

      return c.json({ data: { token }, message: "Login successful" }, 200);
    } catch (error) {
      return c.json({ data: null, message: "Failed to login" }, 500);
    }
  });

export const authRoutes = routes;
