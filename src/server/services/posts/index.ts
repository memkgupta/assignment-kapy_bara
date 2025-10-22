import db from "@/db";
import { categories } from "@/db/schema/categories";
import { CreatePostType, posts } from "@/db/schema/post";
import { postCategories } from "@/db/schema/postCategories";
import { handleDBError } from "@/server/utils/errors/handleDBError";
import { PostWithCategories } from "@/types/posts";
import { TRPCError } from "@trpc/server";

import { lt, desc, eq, ilike, lte, and } from "drizzle-orm";
import { z } from "zod/v4";

export const getPosts = async (filters: {
  search?: string;
  page: number;
  limit: number;
}) => {
  const { search, page, limit } = filters;
  const realLimit = limit + 1;
  let cursorCreatedAt: Date | null = null;

  // Fix 1: Cursor logic is broken - simplified approach
  if (page > 1) {
    const offset = (page - 1) * limit;
    const prevCursorQuery = await db
      .select({ createdAt: posts.createdAt })
      .from(posts)
      .orderBy(desc(posts.createdAt))
      .limit(1)
      .offset(offset - 1); // Get the last item from previous page

    if (prevCursorQuery.length > 0) {
      cursorCreatedAt = prevCursorQuery[0].createdAt;
    }
  }

  const whereConditions = [];

  if (search && search.length > 1) {
    whereConditions.push(ilike(posts.title, `%${search}%`));
  }

  if (cursorCreatedAt) {
    whereConditions.push(lt(posts.createdAt, cursorCreatedAt));
  }

  // Fix 2: Build query properly
  let baseQuery = db
    .select()
    .from(posts)
    .leftJoin(postCategories, eq(posts.id, postCategories.postId))
    .leftJoin(categories, eq(postCategories.categoryId, categories.id))
    .orderBy(desc(posts.createdAt))
    .limit(realLimit);

  // Fix 3: Apply where conditions
  if (whereConditions.length > 0) {
    baseQuery = baseQuery.where(and(...whereConditions)) as any;
  }

  const result = await baseQuery;

  // Fix 4: Handle null createdAt
  const postMap = new Map<
    string,
    { post: any; categories: { name: string; slug: string }[] }
  >();

  result?.forEach((row) => {
    if (!postMap.has(row.posts.id)) {
      postMap.set(row.posts.id, { post: row.posts, categories: [] });
    }
    if (row.categories?.id) {
      postMap.get(row.posts.id)?.categories.push({
        name: row.categories.name,
        slug: row.categories.slug,
      });
    }
  });

  const _posts = Array.from(postMap.values());

  // Pagination metadata
  let hasNext = false;
  if (_posts.length > limit) {
    hasNext = true;
    _posts.pop();
  }

  const prev = page > 1 ? page - 1 : null;
  const next = hasNext ? page + 1 : null;

  return {
    posts: _posts,
    prev,
    next,
  };
};
export const createPost = async (data: CreatePostType) => {
  try {
    const [post] = await db.insert(posts).values(data).returning();
    return post;
  } catch (error: any) {
    handleDBError(error);
  }
};
export const updatePost = async (data: CreatePostType) => {
  try {
    const updated = await db
      .update(posts)
      .set(data)
      .where(eq(posts.id, data.id as string))
      .returning();
    return updated;
  } catch (error: any) {
    if (error.code) {
      handleDBError(error);
    } else {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      });
    }
  }
};
export const getBySlug = async (slug: string) => {
  const result = await db
    .select()
    .from(posts)
    .where(eq(posts.slug, slug))
    .leftJoin(postCategories, eq(posts.id, postCategories.postId))
    .leftJoin(categories, eq(categories.id, postCategories.categoryId));
  if (result.length == 0) return null;
  const post: PostWithCategories = { post: result[0].posts, categories: [] };
  result.forEach(
    (row) =>
      row.categories?.id &&
      post.categories.push({
        name: row.categories.name,
        slug: row.categories.slug,
      }),
  );
  return post;
};
