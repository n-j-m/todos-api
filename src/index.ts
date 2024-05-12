import { loginRoutes } from "@/routes/login";
import { signupRoutes } from "@/routes/signup";
import { todoListIdRoutes, todoListRoutes } from "@/routes/todo-lists";
import { todosRoutes, todoIdRoutes } from "@/routes/todos";
import { AppContext, AppEnv } from "@/types";
import { initApp } from "@/utils/app-factory";
import { createFactory } from "hono/factory";
import { getLucia } from "./utils/get-lucia";
import { getDb } from "./db";

const factory = createFactory<AppContext>({
  initApp: initApp,
});

const app = factory.createApp();

app
  .basePath("/api")
  .route("/signup", signupRoutes)
  .route("/login", loginRoutes)
  .route("/lists", todoListRoutes)
  .route("/lists/:listId", todoListIdRoutes)
  .route("/lists/:listId/todos", todosRoutes)
  .route("/lists/:listId/todos/:todoId", todoIdRoutes);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default {
  fetch: app.fetch,
  async scheduled(controller: ScheduledController, env: AppEnv, ctx: ExecutionContext) {
    const D1 = env.D1;
    const db = getDb(D1);
    const lucia = getLucia(db);
    await lucia.deleteExpiredSessions();
  }

};
