import AllPosts from "../_components/home/AllPosts";
import RecentPosts from "../_components/home/RecentPosts";
import { serverClient } from "../_trpc/server_client";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const filters = {};
  return (
    <>
      <RecentPosts />
      <AllPosts searchParams={{ page: Number(page ?? 1) }} />
    </>
  );
}
