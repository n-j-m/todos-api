import { todoLists } from "@/db/schema/todo-lists";
import { users } from "@/db/schema/users";
import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const todos = sqliteTable("todos", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  done: integer("done", { mode: "boolean" }).notNull().default(false),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id),
  listId: integer("list_id")
    .notNull()
    .references(() => todoLists.id),
});

export const todoRelations = relations(todos, ({ one }) => ({
  user: one(users),
  list: one(todoLists),
}));

export const newTodoSchema = createInsertSchema(todos);

export type NewTodo = z.infer<typeof newTodoSchema>;

export const updateTodoSchema = newTodoSchema
  .extend({
    title: z.string().optional(),
    description: z.string().optional(),
    done: z.boolean().optional(),
  })
  .pick({
    title: true,
    description: true,
    done: true,
  });

export type UpdateTodo = z.infer<typeof updateTodoSchema>;
