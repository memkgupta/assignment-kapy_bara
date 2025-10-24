import db from "@/db";
import { publicProcedure, router } from "../trpc";
import { createPostSchema, posts, selectPostSchema } from "@/db/schema/post";
import { z } from "zod/v4";
import { eq } from "drizzle-orm";
import { createPost, getBySlug, getPosts, updatePost } from "../services/posts";
import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { handleDBError } from "../utils/errors/handleDBError";
import { categories, selectCategorySchema } from "@/db/schema/categories";

export const postRouter = router({
  all: publicProcedure
    .input(
      z.object({
        page: z.number().gt(0).default(0),
        limit: z.number().gte(3).lte(50).default(10),
        search: z.string().max(100).optional(),
        categories: z.array(z.string()).min(0).optional(),
      }),
    )
    .query(async ({ input }) => {
      const posts = await getPosts({
        page: input.page,
        limit: input.limit,
        search: input.search,
        categories: input.categories,
      });
      return posts;
    }),
  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const post = await getBySlug(input.slug);
      if (post == null) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `${input.slug} not found`,
        });
      }
      return post;
    }),
  create: publicProcedure
    .input(
      createPostSchema
        .pick({
          title: true,
          content: true,
          description: true,
          slug: true,
          published: true,
          banner: true,
          thumbnail: true,
        })
        .extend({
          categories: z.array(selectCategorySchema).min(1),
          slug: z.string().optional(),
        }),
    )
    .mutation(async ({ input }) => {
      try {
        const created = await createPost(input);
        return created;
      } catch (error: any) {
        console.log(error);
        if (!error.code) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
          });
        }
        handleDBError(error);
      }
    }),
  update: publicProcedure
    .input(
      selectPostSchema
        .pick({
          id: true,
          title: true,
          content: true,
          description: true,
          published: true,
          slug: true,
          banner: true,
          thumbnail: true,
        })
        .extend({
          categories: z.array(selectCategorySchema).min(1).optional(),
        }),
    )
    .mutation(async ({ input }) => {
      if (!input.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Post id is required",
        });
      }
      return updatePost(input);
    }),
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await db.delete(posts).where(eq(posts.id, input.id));
      return true;
    }),
});
