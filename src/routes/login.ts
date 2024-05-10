import { getUserByUsername } from "@/db/queries";
import { AppContext } from "@/types";
import { initApp } from "@/utils/app-factory";
import { BadRequestException } from "@/utils/problem";
import { verify } from "@/utils/pwd";
import { zValidator } from "@hono/zod-validator";
import { env } from "hono/adapter";
import { createFactory } from "hono/factory";
import { sign } from "hono/jwt";
import { z } from "zod";

const loginFactory = createFactory<AppContext>({ initApp });

export const loginRoutes = loginFactory.createApp();

const loginRequestSchema = z.object({
  username: z.string(),
  password: z.string(),
});

const validateLoginRequest = zValidator("json", loginRequestSchema);

loginRoutes.post("/", validateLoginRequest, async (c) => {
  const { JWT_SECRET } = env(c);
  const { db, lucia } = c.var;

  const { username, password } = c.req.valid("json");

  const existing = await getUserByUsername(db, username);

  if (!existing) {
    throw new BadRequestException("Invalid credentials");
  }

  if (!existing.password) {
    throw new BadRequestException("Invalid credentials");
  }

  const verified = await verify(password, existing.password);

  if (!verified) {
    throw new BadRequestException("Invalid credentials");
  }

  const session = await lucia.createSession(existing.id, {});

  const token = await sign(
    { sub: existing.id, aud: session.id },
    JWT_SECRET,
    "HS256"
  );

  return c.json({ access_token: token });
});
