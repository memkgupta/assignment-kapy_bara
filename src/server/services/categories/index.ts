import db from "@/db";
import { categories, CreateCategoryType } from "@/db/schema/categories";
import { handleDBError } from "@/server/utils/errors/handleDBError";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

export const getCategories = async () => {
  try {
    const categs = await db.select().from(categories);
    return categs;
  } catch (error) {
    handleDBError(error);
  }
};
export const addCategory = async (data: CreateCategoryType) => {
  try {
    const [categ] = await db.insert(categories).values(data).returning();
    return categ;
  } catch (error) {
    handleDBError(error);
  }
};
export const updateCategory = async (data: CreateCategoryType) => {
  if (!data.id) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Id is required",
    });
  }
  try {
    const [categ] = await db
      .update(categories)
      .set(data)
      .where(eq(categories.id, data.id as number))
      .returning();
    return categ;
  } catch (error) {
    handleDBError(error);
  }
};
