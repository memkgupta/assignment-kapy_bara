import { TRPCError } from "@trpc/server";

/**
 * Generic DB error handler
 * @param err - The raw DB error
 * @param entityName - Optional entity/table name for nicer messages
 */
export const handleDBError = (err: any, entityName?: string) => {
  const name = entityName ? entityName : "Record";

  switch (err.code) {
    case "23505": // unique constraint violation
      throw new TRPCError({
        code: "CONFLICT",
        message: `${name} already exists.`,
      });
    case "23503": // foreign key violation
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Invalid related ${name.toLowerCase()}.`,
      });
    case "23514": // check constraint violation
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `${name} failed a database constraint.`,
      });
    default:
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database error occurred.",
        cause: err,
      });
  }
};
