import { users } from "@/db/schema/users";
import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const todoLists = sqliteTable("todo_lists", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id),
});

export const todoListsRelations = relations(todoLists, ({ one }) => ({
  user: one(users),
}));

export const newTodoListSchema = createInsertSchema(todoLists);

export type NewTodoList = z.infer<typeof newTodoListSchema>;

export const updateTodoListSchema = newTodoListSchema.pick({
  name: true,
});

export type TodoListUpdate = z.infer<typeof updateTodoListSchema>;
