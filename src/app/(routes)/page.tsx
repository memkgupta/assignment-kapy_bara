import AllPosts from "../_components/home/AllPosts";
import RecentPosts from "../_components/home/RecentPosts";
import { serverClient } from "../_trpc/server_client";

export default async function Page({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  console.log(await searchParams);
  return (
    <>
      <RecentPosts />
      <AllPosts searchParams={searchParams} />
    </>
  );
}
