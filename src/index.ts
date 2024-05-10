import { loginRoutes } from "@/routes/login";
import { signupRoutes } from "@/routes/signup";
import { todoListIdRoutes, todoListRoutes } from "@/routes/todo-lists";
import { todosRoutes, todoIdRoutes } from "@/routes/todos";
import { AppContext } from "@/types";
import { initApp } from "@/utils/app-factory";
import { createFactory } from "hono/factory";

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

export default app;
