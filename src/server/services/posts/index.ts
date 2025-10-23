import db from "@/db";
import { categories, Category } from "@/db/schema/categories";
import { CreatePostType, Post, posts } from "@/db/schema/post";
import { postCategories } from "@/db/schema/postCategories";
import { handleDBError } from "@/server/utils/errors/handleDBError";
import { PostWithCategories } from "@/types/posts";
import { TRPCError } from "@trpc/server";

import { lt, desc, eq, ilike, lte, and, inArray } from "drizzle-orm";
import { z } from "zod/v4";

export const getPosts = async (filters: {
  search?: string;
  page: number;
  limit: number;
  categories?: string[];
}) => {
  const { search, page, limit } = filters;
  const realLimit = limit + 1;
  let cursorCreatedAt: Date | null = null;

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

  let baseQuery = db
    .select()
    .from(posts)
    .leftJoin(postCategories, eq(posts.id, postCategories.postId))
    .leftJoin(categories, eq(postCategories.categoryId, categories.id))
    .orderBy(desc(posts.createdAt))
    .limit(realLimit);

  if (filters.categories && filters.categories.length > 0) {
    whereConditions.push(inArray(categories.slug, filters.categories));
  }
  if (whereConditions.length > 0) {
    baseQuery = baseQuery.where(and(...whereConditions)) as any;
  }

  const result = await baseQuery;

  const postMap = new Map<
    string,
    { post: Post; categories: { id: number; name: string; slug: string }[] }
  >();

  result?.forEach((row) => {
    if (!postMap.has(row.posts.id)) {
      postMap.set(row.posts.id, { post: row.posts, categories: [] });
    }
    if (row.categories?.id) {
      postMap.get(row.posts.id)?.categories.push({
        id: row.categories.id,
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
export const createPost = async (
  data: CreatePostType & { categories: Category[] },
) => {
  try {
    return await db.transaction(async (tx) => {
      // Insert the post
      const [post] = await tx.insert(posts).values(data).returning();
      const categ_slugs = data.categories.map((c) => c.slug);

      // Get category IDs from slugs
      const categs = await tx
        .select()
        .from(categories)
        .where(inArray(categories.slug, categ_slugs));

      // Insert post-category relations
      if (categs.length > 0) {
        await tx
          .insert(postCategories)
          .values(categs.map((c) => ({ postId: post.id, categoryId: c.id })));
      }

      return post;
    });
  } catch (error: any) {
    if (error.code) handleDBError(error);
    else
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      });
  }
};
export const updatePost = async (
  data: Partial<Post> & { categories?: Category[] },
) => {
  try {
    await db.transaction(async (tx) => {
      const [updated] = await tx
        .update(posts)
        .set(data)
        .where(eq(posts.id, data.id!))
        .returning();

      if (data.categories) {
        const oldCategs = await tx
          .select()
          .from(postCategories)
          .where(eq(postCategories.postId, data.id!))
          .leftJoin(categories, eq(categories.id, postCategories.categoryId));

        const oldSlugs = oldCategs
          .map((c) => c.categories?.slug)
          .filter(Boolean) as string[];
        const nSlugs = data.categories.map((c) => c.slug);
        const toAdd = data.categories
          .filter((categ) => !oldSlugs.includes(categ.slug))
          .map((c) => c.slug);
        const toDelete = oldCategs.filter(
          (c) => c.categories && !nSlugs.includes(c.categories.slug),
        );

        const n_categs = await tx
          .select()
          .from(categories)
          .where(inArray(categories.slug, toAdd));

        await tx.delete(postCategories).where(
          and(
            eq(postCategories.postId, updated.id),
            inArray(
              postCategories.categoryId,
              toDelete.map((t) => t.categories!.id),
            ),
          ),
        );

        await tx
          .insert(postCategories)
          .values(
            n_categs.map((c) => ({ postId: updated.id, categoryId: c.id })),
          );
      }

      return updated;
    });
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
        id: row.categories.id,
        name: row.categories.name,
        slug: row.categories.slug,
      }),
  );
  return post;
};
