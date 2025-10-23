"use client";
import { PostWithCategories } from "@/types/posts";
import { PostCard } from "./PostCard";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";
import { SquareArrowOutUpRight } from "lucide-react";

export default function PostCardHero({ data }: { data: PostWithCategories }) {
  const { post, categories } = data;

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

  return (
    <PostCard className="group overflow-hidden  transition-all duration-500 border border-gray-200 dark:border-gray-700">
      <div className="relative">
        {post.banner && (
          <PostCard.Thumbnail className="relative overflow-hidden">
            <div className=" sm:aspect-video relative">
              <Image
                src={post.banner}
                alt={post.title}
                fill
                className="object-cover "
                priority
              />
              {/* Gradient overlay for better text readability */}
            </div>
          </PostCard.Thumbnail>
        )}

        <div className="p-6 sm:p-8 space-y-5">
          <PostCard.Header>
            <div className="grid gap-4">
              <span className="inline-block text-xs font-semibold text-purple-500 uppercase tracking-wider">
                {format(post.createdAt, "MMMM dd, yyyy")}
              </span>

              {/* Title */}
              <div className="flex items-start justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight ">
                  {post.title}
                </h2>
                <Link href={`/post/${post.slug}`}>
                  <SquareArrowOutUpRight className="text-gray-500" />
                </Link>
              </div>
            </div>
          </PostCard.Header>
          <PostCard.Body className="space-y-4">
            {/* Date badge */}

            {/* Description */}
            {post.description && (
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
                {post.description}
              </p>
            )}

            {/* Read more indicator */}
          </PostCard.Body>

          {/* Categories */}
          {categories.length > 0 && (
            <PostCard.Footer className="pt-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 5).map((categ, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className={`capitalize text-xs font-medium px-4 py-1.5 ${getRandomColor()} border-0 hover:scale-105 transition-transform duration-200`}
                  >
                    {categ.name}
                  </Badge>
                ))}
                {categories.length > 5 && (
                  <Badge
                    variant="secondary"
                    className="text-xs font-medium px-4 py-1.5 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-0"
                  >
                    +{categories.length - 5} more
                  </Badge>
                )}
              </div>
            </PostCard.Footer>
          )}
        </div>
      </div>
    </PostCard>
  );
}
