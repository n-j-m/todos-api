import {
  createTodoList,
  deleteTodoList,
  getTodoListForUser,
  getTodoListsForUser,
  udpateTodoList,
} from "@/db/queries";
import { authorize } from "@/middleware/authorize";
import { AuthedAppContext, TodoListContext } from "@/types";
import { initApp } from "@/utils/app-factory";
import { InternalServerException, NotFoundException } from "@/utils/problem";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createFactory } from "hono/factory";
import { z } from "zod";

const todoListFactory = createFactory<AuthedAppContext>({
  initApp: (app) => {
    initApp(app);
    app.use("*", authorize());
  },
});

export const todoListRoutes = todoListFactory.createApp();

const newTodoListRequestSchema = z.object({
  name: z.string(),
});

const validateNewTodoListRequest = zValidator("json", newTodoListRequestSchema);

todoListRoutes.post("/", validateNewTodoListRequest, async (c) => {
  const { db, user } = c.var;

  const { name } = c.req.valid("json");

  const created = await createTodoList(db, { name, ownerId: user.id });

  if (!created) {
    throw new InternalServerException("Unable to verify list creation");
  }

  return c.json(created, 201);
});

todoListRoutes.get("/", async (c) => {
  const { db, user } = c.var;

  const lists = await getTodoListsForUser(db, user.id);

  return c.json(lists);
});

export function createTodoListIdFactory<
  C extends TodoListContext = TodoListContext
>(init?: (app: Hono<C>) => void) {
  const todoListIdFactory = createFactory<C>({
    initApp: (app) => {
      initApp(app);
      app.use("*", authorize<TodoListContext>(), async (c, next) => {
        const listId = Number(c.req.param("listId"));
        if (listId) {
          c.set("listId", listId);
        }
        await next();
      });
      if (init) {
        init(app);
      }
    },
  });
  return todoListIdFactory;
}

export const todoListIdRoutes = createTodoListIdFactory().createApp();

todoListIdRoutes.get("/", async (c) => {
  const { db, user, listId } = c.var;

  const list = await getTodoListForUser(db, user.id, listId);

  if (!list) {
    throw new NotFoundException();
  }

  return c.json(list);
});

const todoListUpdateRequestSchema = z.object({
  name: z.string(),
});

const validateTodoListUpdateRequest = zValidator(
  "json",
  todoListUpdateRequestSchema
);

todoListIdRoutes.put("/", validateTodoListUpdateRequest, async (c) => {
  const { db, user, listId } = c.var;

  const listUpdateRequest = c.req.valid("json");

  const list = await udpateTodoList(db, user.id, listId, listUpdateRequest);

  if (!list) {
    throw new NotFoundException();
  }

  return c.json(list);
});

todoListIdRoutes.delete("/", async (c) => {
  const { db, user, listId } = c.var;

  const deleted = await deleteTodoList(db, user.id, listId);

  if (!deleted) {
    throw new NotFoundException();
  }

  return c.json({
    message: "Deleted successfully",
    deleted,
  });
});
