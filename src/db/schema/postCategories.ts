import { integer, pgTable, serial, uuid, varchar } from "drizzle-orm/pg-core";
import { posts } from "./post";
import { categories } from "./categories";

export const postCategories = pgTable("post_categories", {
  id: serial("id").primaryKey(),
  postId: uuid("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  categoryId: integer("category_id").references(() => categories.id),
});
