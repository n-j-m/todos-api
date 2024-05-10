import { createUser } from "@/db/queries";
import { AppContext } from "@/types";
import { initApp } from "@/utils/app-factory";
import { InternalServerException } from "@/utils/problem";
import { hash } from "@/utils/pwd";
import { zValidator } from "@hono/zod-validator";
import { createFactory } from "hono/factory";
import { generateIdFromEntropySize } from "lucia";
import { z } from "zod";

const signupFactory = createFactory<AppContext>({
  initApp,
});

export const signupRoutes = signupFactory.createApp();

const signupRequestSchema = z.object({
  username: z.string(),
  password: z.string().min(6),
});

const validateSignupRequest = zValidator("json", signupRequestSchema);

signupRoutes.post("/", validateSignupRequest, async (c) => {
  const { db, lucia } = c.var;

  const { username, password } = c.req.valid("json");

  const userId = generateIdFromEntropySize(10);

  const passwordHash = await hash(password);

  const created = await createUser(db, {
    id: userId,
    username,
    password: passwordHash,
  });

  if (!created) {
    throw new InternalServerException("Unable to verify user creation");
  }

  return c.json(
    {
      message: "Welcome",
      created: { username: created.username },
    },
    201
  );
});
