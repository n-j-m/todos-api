import { drizzle } from "drizzle-orm/d1";
import { sessions, todoLists, todos, users } from "@/db/schema";

export function getDb(d1: D1Database, logger?: boolean) {
  const db = drizzle(d1, {
    logger,
    schema: { users, sessions, todoLists, todos },
  });
  return db;
}
