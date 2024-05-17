import { loginRoutes } from "@/routes/login";
import { signupRoutes } from "@/routes/signup";
import { todoListIdRoutes, todoListRoutes } from "@/routes/todo-lists";
import { todosRoutes, todoIdRoutes } from "@/routes/todos";
import { AppContext, AppEnv } from "@/types";
import { initApp } from "@/utils/app-factory";
import { createFactory } from "hono/factory";
import { getLucia } from "./utils/get-lucia";
import { getDb } from "./db";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { env } from "hono/adapter";
import { Context } from "hono";

const factory = createFactory<AppContext>({
  initApp: initApp,
});

const app = factory.createApp();

app.use(logger());

app.use(
  "/api/*",
  cors({
    origin: (origin, c: Context<AppContext>) => {
      const { CORS_ORIGINS } = env(c);
      console.log("origins:", CORS_ORIGINS);
      const origins = CORS_ORIGINS.split(",");
      const matched = origins.find((o) => o === origin);
      return matched;
    },
    allowHeaders: ["*"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

app
  .basePath("/api")
  .route("/signup", signupRoutes)
  .route("/login", loginRoutes)
  .route("/lists", todoListRoutes)
  .route("/lists/:listId", todoListIdRoutes)
  .route("/lists/:listId/todos", todosRoutes)
  .route("/lists/:listId/todos/:todoId", todoIdRoutes);

app.get("/api/healthcheck", (c) => {
  return c.text("Hello Hono!");
});

export default {
  fetch: app.fetch,
  async scheduled(
    controller: ScheduledController,
    env: AppEnv,
    ctx: ExecutionContext,
  ) {
    const D1 = env.D1;
    const db = getDb(D1);
    const lucia = getLucia(db);
    await lucia.deleteExpiredSessions();
  },
};
