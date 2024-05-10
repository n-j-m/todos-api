import {
  createTodo,
  deleteTodo,
  getTodo,
  getTodosForList,
  updateTodo,
} from "@/db/queries";
import { createTodoListIdFactory } from "@/routes/todo-lists";
import { TodoListAppVars, TodoListContext } from "@/types";
import { InternalServerException, NotFoundException } from "@/utils/problem";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const todosFactory = createTodoListIdFactory();

export const todosRoutes = todosFactory.createApp();

const newTodoRequestSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  done: z.boolean().optional().default(false),
});

const validateNewTodoRequest = zValidator("json", newTodoRequestSchema);

todosRoutes.post("/", validateNewTodoRequest, async (c) => {
  const { db, user, listId } = c.var;

  const newTodoRequest = c.req.valid("json");

  const newTodo = await createTodo(db, {
    ...newTodoRequest,
    ownerId: user.id,
    listId,
  });

  if (!newTodo) {
    throw new InternalServerException("Unable to verify todo creation");
  }

  return c.json(newTodo, 201);
});

todosRoutes.get("/", async (c) => {
  const { db, user, listId } = c.var;

  const results = await getTodosForList(db, user.id, listId);

  return c.json(results);
});

type TodosContext = TodoListContext & {
  Variables: TodoListAppVars & { todoId: number };
};

const todoIdFactory = createTodoListIdFactory<TodosContext>((app) => {
  app.use("*", async (c, next) => {
    const todoId = Number(c.req.param("todoId"));
    if (!todoId) {
      throw new NotFoundException();
    }

    c.set("todoId", todoId);

    await next();
  });
});
export const todoIdRoutes = todoIdFactory.createApp();

todoIdRoutes.get("/", async (c) => {
  const { db, user, listId, todoId } = c.var;

  const todo = await getTodo(db, user.id, listId, todoId);

  if (!todo) {
    throw new NotFoundException();
  }

  return c.json(todo);
});

const updateTodoRequestSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  done: z.boolean().optional(),
});

const validateUpdateTodoRequest = zValidator("json", updateTodoRequestSchema);

todoIdRoutes.put("/", validateUpdateTodoRequest, async (c) => {
  const { db, user, listId, todoId } = c.var;

  const updateRequest = c.req.valid("json");

  const updated = await updateTodo(db, user.id, listId, todoId, updateRequest);

  if (!updated) {
    throw new NotFoundException();
  }

  return c.json(updated);
});

todoIdRoutes.delete("/", async (c) => {
  const { db, user, listId, todoId } = c.var;

  const deleted = await deleteTodo(db, user.id, listId, todoId);

  if (!deleted) {
    throw new NotFoundException();
  }

  return c.json({
    message: "Delete successful",
    deleted,
  });
});
