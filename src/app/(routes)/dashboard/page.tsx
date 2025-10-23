import { serverClient } from "@/app/_trpc/server_client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Pencil, Trash2, Plus, FileText } from "lucide-react";
import { CursorPagination } from "@/app/_components/utils/PaginationButton";

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ page?: number }>;
}) {
  // Fetch user posts
  let { page } = await searchParams;
  page = Number(page ?? 1);
  const { posts, prev, next } = await serverClient.posts.all({ page: page });

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
          <div className="overflow-x-auto rounded-lg border border-border/40">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(({ post }) => (
                  <tr
                    key={post.id}
                    className="border-t border-border/40 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                      {post.title}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 max-w-md truncate">
                      {post.description?.slice(0, 100) ||
                        "No description available"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          post.published
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/dashboard/posts/${post.slug}/edit`}>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <CursorPagination prev={prev} next={next} />
          </div>
        )}
      </div>
    </section>
  );
}
