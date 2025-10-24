import { AppRouter } from "@/server";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import {
  createTRPCClient,
  createTRPCReact,
  httpBatchLink,
} from "@trpc/react-query";
import { QueryClient } from "@tanstack/react-query";
export const queryClient = new QueryClient();
const trpcClient = createTRPCClient<AppRouter>({
  links: [httpBatchLink({ url: "/api/trpc" })],
});
export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient: queryClient,
});
