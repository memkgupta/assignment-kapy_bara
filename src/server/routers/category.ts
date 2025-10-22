import { createCategorySchema } from "@/db/schema/categories";
import {
  addCategory,
  getCategories,
  updateCategory,
} from "../services/categories";
import { publicProcedure, router } from "../trpc";

export const categoryRouter = router({
  all: publicProcedure.query(async () => {
    const categs = await getCategories();
    return categs;
  }),
  add: publicProcedure
    .input(createCategorySchema.pick({ slug: true, name: true }))
    .mutation(async ({ input }) => {
      const category = await addCategory(input);
      return category;
    }),
  update: publicProcedure
    .input(
      createCategorySchema.pick({
        slug: true,
        name: true,
        id: true,
      }),
    )
    .mutation(async ({ input }) => {
      const updated = updateCategory(input);
      return updated;
    }),
});
