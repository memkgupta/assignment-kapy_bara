"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { queryClient, trpc } from "./client";
import { httpBatchLink } from "@trpc/client";

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </>
  );
}
