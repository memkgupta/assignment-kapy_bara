import {
  boolean,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
export const posts = pgTable("posts", {
  id: uuid().primaryKey().defaultRandom(),
  title: varchar("title", {
    length: 200,
  }).notNull(),
  content: text("content").notNull(),
  thumbnail: varchar("thumbnail"),
  description: text("description"),
  banner: varchar("banner"),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  published: boolean("published").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const createPostSchema = createInsertSchema(posts);
export const selectPostSchema = createSelectSchema(posts);
export type CreatePostType = typeof posts.$inferInsert;
export type Post = typeof posts.$inferSelect;
