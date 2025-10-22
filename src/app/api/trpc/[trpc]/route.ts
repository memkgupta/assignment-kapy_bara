import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
// import { createTRPCContext } from '@/server/trpc';
import { appRouter } from "@/server/index";
const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({}),
    // createContext: createTRPCContext,
  });
export { handler as GET, handler as POST };
