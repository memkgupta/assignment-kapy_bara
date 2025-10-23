"use client";
import { PostWithCategories } from "@/types/posts";
import { PostCard } from "./PostCard";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";
import { SquareArrowOutUpRight } from "lucide-react";

export default function PostCardVertical({
  data,
}: {
  data: PostWithCategories;
}) {
  const getRandomColor = () => {
    const colors = [
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
      "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
      "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const { post, categories } = data;

  return (
    <PostCard className="group overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
      {post.banner && (
        <PostCard.Thumbnail className="relative overflow-hidden">
          <div className="aspect-video relative">
            <Image
              fill
              alt={post.title}
              src={post.banner}
              className="object-cover "
            />
          </div>
        </PostCard.Thumbnail>
      )}

      <div className="pl-2 space-y-4">
        <PostCard.Header className="mt-2 ">
          <div className="grid gap-5">
            <span className="font-bold text-xs text-purple-500">
              {format(post.createdAt, "PPP")}
            </span>
            <div className="flex items-start justify-between px-2">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight ">
                {post.title}
              </h3>
              <Link href={`/post/${post.slug}`}>
                <SquareArrowOutUpRight className="text-gray-500" />
              </Link>
            </div>
          </div>
        </PostCard.Header>
        <PostCard.Body className="mr-2">
          {post.description && (
            <p className="text-sm text-gray-400 dark:text-gray-400 line-clamp-3 leading-relaxed">
              {post.description}
            </p>
          )}
        </PostCard.Body>

        {categories.length > 0 && (
          <PostCard.Footer className="pt-2 pb-2 border-t border-gray-100 dark:border-gray-800">
            <div className="flex flex-wrap gap-2">
              {categories.slice(0, 4).map((categ, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className={`capitalize text-xs font-medium px-3 py-1 ${getRandomColor()} border-0`}
                >
                  {categ.name}
                </Badge>
              ))}
              {categories.length > 4 && (
                <Badge
                  variant="secondary"
                  className="text-xs font-medium px-3 py-1 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-0"
                >
                  +{categories.length - 4}
                </Badge>
              )}
            </div>
          </PostCard.Footer>
        )}
      </div>
    </PostCard>
  );
}
