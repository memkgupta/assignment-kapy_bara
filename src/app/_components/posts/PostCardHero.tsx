"use client";
import { PostWithCategories } from "@/types/posts";
import { PostCard } from "./PostCard";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function PostCardHero({ data }: { data: PostWithCategories }) {
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
    <PostCard className="hover:shadow-2xl transition-shadow duration-300">
      <Link href={`/post/${post.slug}`}>
        <div className="flex flex-col gap-4">
          {post.banner && (
            <PostCard.Thumbnail className="w-full h-60 sm:h-72 md:h-96 relative overflow-hidden rounded-t-lg">
              <Image
                src={post.banner}
                alt={post.title}
                fill
                className="object-cover w-full h-full"
              />
            </PostCard.Thumbnail>
          )}
          <div className="flex flex-col justify-between flex-1">
            <PostCard.Body className="p-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {post.title}
              </h2>
              {post.description && (
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                  {post.description?.length > 100
                    ? post.description.slice(0, 100) + "..."
                    : post.description}
                </p>
              )}
            </PostCard.Body>
            {categories.length > 0 && (
              <PostCard.Footer className="p-4 pt-2">
                <div className="flex flex-wrap gap-2">
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
