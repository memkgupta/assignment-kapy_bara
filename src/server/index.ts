import { categoryRouter } from "./routers/category";
import { postRouter } from "./routers/post";
import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  getTodos: publicProcedure.query(async () => {
    return [10, 20, 30];
  }),
  posts: postRouter,
  categories: categoryRouter,
});
export type AppRouter = typeof appRouter;
