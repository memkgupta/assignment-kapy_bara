"use client";
import { PostWithCategories } from "@/types/posts";
import { PostCard } from "./PostCard";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

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
      "red",
      "blue",
      "green",
      "yellow",
      "purple",
      "orange",
      "pink",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <PostCard
      className={`hover:shadow-lg transition-shadow duration-300 ${className}`}
    >
      <Link href={`/post/${post.slug}`}>
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          {post.thumbnail && (
            <PostCard.Thumbnail className="shrink-0">
              <Image
                width={200}
                height={150}
                alt={post.title}
                src={post.thumbnail}
                className="w-full sm:w-[200px] h-[150px] object-cover rounded-lg"
              />
            </PostCard.Thumbnail>
          )}
          <div className="flex-1 flex flex-col justify-between">
            <PostCard.Body className="p-4 sm:p-0">
              <div className="grid gap-2">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {post.title}
                </p>
                {post.description && (
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {post.description.length > 100
                      ? post.description.slice(0, 100) + "..."
                      : post.description}
                  </p>
                )}
              </div>
            </PostCard.Body>

            {categories.length > 0 && (
              <PostCard.Footer className="p-4 sm:p-0 pt-2">
                <div className="flex flex-wrap gap-2 mt-2">
                  {categories.map((categ, index) => (
                    <Badge
                      key={index}
                      color={getRandomColor()}
                      className="capitalize"
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
