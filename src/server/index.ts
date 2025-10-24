import { categoryRouter } from "./routers/category";
import { postRouter } from "./routers/post";
import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  posts: postRouter,
  categories: categoryRouter,
});
export type AppRouter = typeof appRouter;
