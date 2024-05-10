import { getDb } from "@/db";
import { AppContext } from "@/types";
import { getLucia } from "@/utils/get-lucia";
import { Hono } from "hono";
import { env } from "hono/adapter";

export function initApp<C extends AppContext = AppContext>(app: Hono<C>) {
  app.use("*", async (c, next) => {
    const { D1 } = env(c);
    const db = getDb(D1);

    c.set("db", db);

    const lucia = getLucia(db);
    c.set("lucia", lucia);

    await next();
  });
}
