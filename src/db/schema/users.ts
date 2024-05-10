import { todoLists } from "@/db/schema/todo-lists";
import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: text("id").notNull().primaryKey(),
  username: text("email").notNull(),
  password: text("password"),
});

export const userRelations = relations(users, ({ many }) => ({
  lists: many(todoLists),
}));

export const newUserSchema = createInsertSchema(users);

export type NewUser = z.infer<typeof newUserSchema>;
