import { serverClient } from "@/app/_trpc/server_client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Pencil, Trash2, Plus, FileText } from "lucide-react";

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ page?: number }>;
}) {
  // Fetch user posts
  const { page } = await searchParams;

  const { posts } = await serverClient.posts.all({ page: page });

  const totalPosts = posts.length;
  const published = posts.filter((p) => p.post.published).length;
  const drafts = totalPosts - published;

  return (
    <section className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
        {/*<div className="flex items-center gap-4">
          <Image
            src={user.avatar}
            alt={user.name}
            width={80}
            height={80}
            className="rounded-full border border-gray-300 dark:border-gray-700"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome, {user.name}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>
        </div>*/}

        <Link href="dashboard/posts/create">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Post
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm">
            Total Posts
          </h3>
          <p className="text-2xl font-semibold mt-1">{totalPosts}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm">
            Published
          </h3>
          <p className="text-2xl font-semibold mt-1 text-green-600">
            {published}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm">Drafts</h3>
          <p className="text-2xl font-semibold mt-1 text-yellow-500">
            {drafts}
          </p>
        </div>
      </div>

      {/* User Posts */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Your Posts
        </h2>

        {posts.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-400 text-center py-10">
            <FileText className="mx-auto mb-3 w-10 h-10 opacity-50" />
            <p>You haven't written any posts yet.</p>
            <Link href="/posts/new">
              <Button className="mt-4">Write your first post</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map(({ post }) => (
              <div
                key={post.id}
                className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mt-1 break-words whitespace-normal">
                      {post.description?.slice(0, 100) ||
                        "No description available"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/posts/${post.slug}/edit`}>
                      <Button variant="outline" size="icon">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button variant="destructive" size="icon">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p
                  className={`mt-3 text-sm ${
                    post.published ? "text-green-500" : "text-yellow-500"
                  }`}
                >
                  {post.published ? "Published" : "Draft"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
