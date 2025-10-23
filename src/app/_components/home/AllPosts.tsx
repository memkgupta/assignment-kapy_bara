import { serverClient } from "@/app/_trpc/server_client";
import { CursorPagination } from "../utils/PaginationButton";
import PostCardHorizontal from "../posts/PostCardHorizontal";
import PostCardVertical from "../posts/PostCardVertical";
import { isArray } from "util";
import { categories } from "@/db/schema/categories";

export default async function AllPosts({
  searchParams,
}: {
  searchParams: { page: number; search?: string; categories?: string[] };
}) {
  const page = Number(searchParams.page ?? 1);
  const limit = 9;

  const { posts, prev, next } = await serverClient.posts.all({
    page,
    limit,
    search: searchParams.search,
    categories: Array.isArray(searchParams.categories)
      ? searchParams.categories
      : searchParams.categories
        ? [searchParams.categories]
        : [],
  });

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        All Posts
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCardVertical key={post.post.id} data={post} />
        ))}
      </div>

      {prev && next && (
        <div className="mt-8 flex justify-center">
          <CursorPagination prev={prev} next={next} />
        </div>
      )}
    </section>
  );
}
