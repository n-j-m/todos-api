import { NewUser, users } from "@/db/schema/users";
import { AppDb } from "@/types";
import { eq } from "drizzle-orm";

export async function createUser(db: AppDb, newUser: NewUser) {
  const created = await db.insert(users).values(newUser).returning();

  return created[0] || null;
}

export async function getUserByUsername(db: AppDb, username: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  return user;
}
