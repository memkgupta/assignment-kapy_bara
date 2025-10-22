import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
});

export const createCategorySchema = createInsertSchema(categories);
export const selectCategorySchema = createSelectSchema(categories);
export type CreateCategoryType = typeof categories.$inferInsert;
export type Category = typeof categories.$inferSelect;
