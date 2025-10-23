"use client";
import { serverClient } from "@/app/_trpc/server_client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Pencil, Trash2, Plus, FileText, Loader2 } from "lucide-react";
import { CursorPagination } from "@/app/_components/utils/PaginationButton";
import DeletePostDialog from "@/app/_components/dashboard/DeletePostDialog";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/app/_trpc/client";

export default function Dashboard() {
  // Fetch user posts

  const [page, setPage] = useState(1);

  const { data, isFetching } = useQuery(
    trpc.posts.all.queryOptions(
      {
        page: page,
      },
      { refetchOnWindowFocus: false },
    ),
  );
  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
      </div>
    );
  }
  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        Something went wrong
      </div>
    );
  }
  const { posts, prev, next } = data;
  const totalPosts = posts.length;
  const published = posts.filter((p) => p.post.published).length;
  const drafts = totalPosts - published;

  return (
    <>
      {isFetching ? (
        <Loader2 className="animate-spin" />
      ) : (
        <section className="max-w-6xl mx-auto px-4 py-10 space-y-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
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
              <h3 className="text-gray-500 dark:text-gray-400 text-sm">
                Drafts
              </h3>
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
                      <th className="px-4 py-3 font-medium text-center">
                        Actions
                      </th>
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

                            <DeletePostDialog id={post.id} title={post.title} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-center gap-4 mt-6">
                  <button
                    onClick={() => setPage(prev)}
                    disabled={prev === -1}
                    className={`px-4 py-2 rounded-md border ${
                      prev === -1
                        ? "cursor-not-allowed opacity-50 bg-gray-100"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    ← Previous
                  </button>

                  <button
                    onClick={() => setPage(next)}
                    disabled={next === -1}
                    className={`px-4 py-2 rounded-md border ${
                      next === -1
                        ? "cursor-not-allowed opacity-50 bg-gray-100"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
