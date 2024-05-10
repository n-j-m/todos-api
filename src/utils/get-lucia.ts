import { sessions, users } from "@/db/schema";
import { AppDb } from "@/types";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";

export function getLucia(db: AppDb) {
  const adapter = new DrizzleSQLiteAdapter(db, sessions, users);

  const lucia = new Lucia(adapter);

  return lucia;
}
