import { NewTodoList, TodoListUpdate, todoLists } from "@/db/schema/todo-lists";
import { AppDb } from "@/types";
import { and, eq } from "drizzle-orm";

export async function createTodoList(db: AppDb, newList: NewTodoList) {
  const results = await db.insert(todoLists).values(newList).returning();

  return results[0] || null;
}

export async function getTodoListsForUser(db: AppDb, ownerId: string) {
  const lists = await db.query.todoLists.findMany({
    where: eq(todoLists.ownerId, ownerId),
  });

  return lists;
}

export async function getTodoListForUser(
  db: AppDb,
  ownerId: string,
  listId: number
) {
  const list = await db.query.todoLists.findFirst({
    where: and(eq(todoLists.ownerId, ownerId), eq(todoLists.id, listId)),
  });

  return list;
}

export async function udpateTodoList(
  db: AppDb,
  ownerId: string,
  listId: number,
  listUpdate: TodoListUpdate
) {
  const result = await db
    .update(todoLists)
    .set(listUpdate)
    .where(and(eq(todoLists.ownerId, ownerId), eq(todoLists.id, listId)))
    .returning();

  return result[0] || null;
}

export async function deleteTodoList(
  db: AppDb,
  ownerId: string,
  listId: number
) {
  const result = await db
    .delete(todoLists)
    .where(and(eq(todoLists.ownerId, ownerId), eq(todoLists.id, listId)))
    .returning();

  return result[0] || null;
}
