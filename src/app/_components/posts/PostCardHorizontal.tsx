"use client";
import { PostWithCategories } from "@/types/posts";
import { PostCard } from "./PostCard";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";
interface PostCardHorizontalProps {
  data: PostWithCategories;
  className?: string; // optional className for additional styling
}

export default function PostCardHorizontal({
  data,
  className = "",
}: PostCardHorizontalProps) {
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
    <PostCard
      className={`hover:shadow-lg transition-shadow duration-300 p-1 ${className}`}
    >
      <Link href={`/post/${post.slug}`}>
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          {post.thumbnail && (
            <PostCard.Thumbnail className="shrink-0">
              <Image
                width={200}
                height={200}
                alt={post.title}
                src={post.thumbnail}
                className="w-full sm:w-[200px] h-[150px] object-cover rounded-md"
              />
            </PostCard.Thumbnail>
          )}
          <div className="flex-1 flex flex-col justify-between">
            <PostCard.Header className="grid gap-2">
              <span className="text-pink-600 text-xs font-bold ">
                {format(post.createdAt, "PPP")}
              </span>
              <p className="text-sm font-semibold text-gray-900 dark:text-white ">
                {post.title.slice(0, 40)}...
              </p>
            </PostCard.Header>

            <PostCard.Body className="p-4 sm:p-0 grow max-w-[140px]">
              {post.description && (
                <div className="text-gray-600 dark:text-gray-300 text-sm break-words whitespace-normal">
                  {post.description.length > 100
                    ? post.description.slice(0, 50) + "..."
                    : post.description}
                </div>
              )}
            </PostCard.Body>

            {categories.length > 0 && (
              <PostCard.Footer className="p-4 sm:p-0 pt-2 mt-auto">
                <div className="flex flex-wrap gap-2 mt-2">
                  {categories.map((categ, index) => (
                    <Badge
                      key={index}
                      className={`capitalize ${getRandomColor()} wrap-break-words`}
                    >
                      {categ.name}
                    </Badge>
                  ))}
                </div>
              </PostCard.Footer>
            )}
          </div>
        </div>
      </Link>
    </PostCard>
  );
}
