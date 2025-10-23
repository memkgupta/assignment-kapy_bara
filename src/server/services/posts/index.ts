import db from "@/db";
import { categories, Category } from "@/db/schema/categories";
import { CreatePostType, Post, posts } from "@/db/schema/post";
import { postCategories } from "@/db/schema/postCategories";
import { handleDBError } from "@/server/utils/errors/handleDBError";
import { PostWithCategories } from "@/types/posts";
import { TRPCError } from "@trpc/server";

import { lt, desc, eq, ilike, lte, and, inArray } from "drizzle-orm";
import { z } from "zod/v4";
import { generateUniqueSlug } from "./utils";

export const getPosts = async (filters: {
  search?: string;
  page: number;
  limit: number;
  categories?: string[];
}) => {
  const { search, page, limit, categories: categoryFilter } = filters;
  const offset = (page - 1) * limit;
  const realLimit = limit + 1;

  const whereConditions = [];

  if (search && search.length > 1) {
    whereConditions.push(ilike(posts.title, `%${search}%`));
  }
  let query = db
    .select()
    .from(posts)
    .leftJoin(postCategories, eq(postCategories.postId, posts.id))
    .leftJoin(categories, eq(categories.id, postCategories.categoryId));

  if (search && search.length > 1) {
    whereConditions.push(ilike(posts.title, `%${search}%`));
  }

  if (categoryFilter && categoryFilter.length > 0) {
    whereConditions.push(inArray(categories.slug, categoryFilter));
  }

  if (whereConditions.length > 0) {
    query = query.where(and(...whereConditions)) as any;
  }

  const filteredPosts = await query
    .orderBy(desc(posts.createdAt))
    .limit(realLimit)
    .offset(offset);
  const postIds = filteredPosts.map((p) => p.posts.id);

  const postCategoriesData =
    postIds.length > 0
      ? await db
          .select({
            postId: postCategories.postId,
            categoryId: categories.id,
            categoryName: categories.name,
            categorySlug: categories.slug,
          })
          .from(postCategories)
          .innerJoin(categories, eq(postCategories.categoryId, categories.id))
          .where(inArray(postCategories.postId, postIds))
      : [];

  // const categoryMap = new Map<
  //   string,
  //   { id: number; name: string; slug: string }[]
  // >();
  // postCategoriesData.forEach((pc) => {
  //   if (!categoryMap.has(pc.postId)) {
  //     categoryMap.set(pc.postId, []);
  //   }
  //   categoryMap.get(pc.postId)!.push({
  //     id: pc.categoryId,
  //     name: pc.categoryName,
  //     slug: pc.categorySlug,
  //   });
  // });

  const postsWithCategories = new Map<string, PostWithCategories>();
  filteredPosts.slice(0, limit).forEach((post) => {
    if (!postsWithCategories.has(post.posts.id)) {
      postsWithCategories.set(post.posts.id, {
        post: post.posts,
        categories: post.categories != null ? [post.categories] : [],
      });
    } else if (post.categories != null) {
      postsWithCategories.get(post.posts.id)?.categories.push(post.categories);
    }
  });

  // Pagination metadata
  const hasNext = filteredPosts.length > limit;
  const prev = page > 1 ? page - 1 : -1;
  const next = hasNext ? page + 1 : -1;

  return {
    posts: Array.from(postsWithCategories.values()),
    prev,
    next,
  };
};
export const createPost = async (
  data: Omit<CreatePostType, "slug"> &
    Partial<Pick<CreatePostType, "slug">> & { categories: Category[] },
) => {
  try {
    return await db.transaction(async (tx) => {
      // Insert the post
      if (!data.slug) {
        data.slug = generateUniqueSlug(data.title);
      }
      const [post] = await tx
        .insert(posts)
        .values(data as CreatePostType)
        .returning();
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
