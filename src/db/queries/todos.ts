import { NewTodo, UpdateTodo, todos } from "@/db/schema/todos";
import { AppDb } from "@/types";
import { and, eq } from "drizzle-orm";

export async function createTodo(db: AppDb, newTodo: NewTodo) {
  const result = await db.insert(todos).values(newTodo).returning();

  return result[0] || null;
}

export async function getTodosForUser(db: AppDb, ownerId: string) {
  const results = await db.query.todos.findMany({
    where: eq(todos.ownerId, ownerId),
  });

  return results;
}

export async function getTodosForList(
  db: AppDb,
  ownerId: string,
  listId: number
) {
  const results = await db.query.todos.findMany({
    where: and(eq(todos.ownerId, ownerId), eq(todos.listId, listId)),
  });

  return results;
}

export async function getTodo(
  db: AppDb,
  ownerId: string,
  listId: number,
  todoId: number
) {
  const result = await db.query.todos.findFirst({
    where: and(
      eq(todos.ownerId, ownerId),
      eq(todos.listId, listId),
      eq(todos.id, todoId)
    ),
  });

  return result;
}

export async function updateTodo(
  db: AppDb,
  ownerId: string,
  listId: number,
  todoId: number,
  todoUpdate: UpdateTodo
) {
  const result = await db
    .update(todos)
    .set(todoUpdate)
    .where(
      and(
        eq(todos.ownerId, ownerId),
        eq(todos.listId, listId),
        eq(todos.id, todoId)
      )
    )
    .returning();

  return result[0] || null;
}

export async function deleteTodo(
  db: AppDb,
  ownerId: string,
  listId: number,
  todoId: number
) {
  const result = await db
    .delete(todos)
    .where(
      and(
        eq(todos.ownerId, ownerId),
        eq(todos.listId, listId),
        eq(todos.id, todoId)
      )
    )
    .returning();

  return result[0] || null;
}
