import AllPosts from "@/app/_components/home/AllPosts";
import PostFilters from "@/app/_components/posts/PostFilters";
import { serverClient } from "@/app/_trpc/server_client";

export default async function ({
  searchParams,
}: {
  searchParams: Promise<{ page?: number; search?: string; categs?: string[] }>;
}) {
  const { page, search, categs } = await searchParams;
  const filters = {
    page: Number(page ?? 1),
    search: search ?? "",
    categories: categs ?? undefined,
  };
  const categories = await serverClient.categories.all();

  return (
    <>
      <div className="mt-12">
        {categories && <PostFilters categories={categories} />}
      </div>

      <AllPosts searchParams={filters} />
    </>
  );
}
