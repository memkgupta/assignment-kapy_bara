import { serverClient } from "@/app/_trpc/server_client";
import PostCardVertical from "../posts/PostCardVertical";
import PostCardHorizontal from "../posts/PostCardHorizontal";
import PostCardHero from "../posts/PostCardHero";

export default async function RecentPosts() {
  const { posts } = await serverClient.posts.all({
    limit: 3,
    page: 1,
  });

  return (
    <section className="w-full max-w-6xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-8 tracking-tight text-gray-900 dark:text-white">
        Recent Posts
      </h2>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Hero post */}
        <div className="flex-1 min-w-[320px]">
          {posts.length > 0 && (
            <div className="transition-transform duration-300 hover:scale-[1.01]">
              <PostCardHero data={posts[0]} />
            </div>
          )}
        </div>

        {/* Secondary posts */}
        <div className="flex-1 grid gap-6">
          {posts.length > 1 && (
            <div className="transition-transform duration-300 hover:translate-x-1">
              <PostCardHorizontal data={posts[1]} />
            </div>
          )}
          {posts.length > 2 && (
            <div className="transition-transform duration-300 hover:translate-x-1">
              <PostCardHorizontal data={posts[2]} />
            </div>
          )}
        </div>
      </div>

      {/* subtle border or shadow at bottom */}
      <div className="mt-10 border-t border-gray-200 dark:border-gray-800" />
    </section>
  );
}
