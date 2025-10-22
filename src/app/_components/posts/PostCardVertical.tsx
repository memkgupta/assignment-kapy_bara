"use client";
import { PostWith, PostWithAddOns, PostWithCategories } from "@/types/posts";
import { PostCard } from "./PostCard";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function PostCardVertical({
  data,
}: {
  data: PostWithCategories;
}) {
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
  const { post, categories } = data;
  return (
    <PostCard>
      <Link href={`/post/${post.slug}`}>
        <div className="grid gap-2">
          {post.banner && (
            <PostCard.Thumbnail>
              <Image
                width={600}
                height={200}
                alt="Thumbnail"
                src={post.banner}
              ></Image>
            </PostCard.Thumbnail>
          )}
          <div>
            <PostCard.Body>
              <div className="grid gap-1">
                <p>{post.title}</p>
                <p>{post.description?.slice(100)}...</p>
              </div>
            </PostCard.Body>
            <PostCard.Footer>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {categories.map((categ, index) => (
                  <Badge key={index} color={getRandomColor()}>
                    {categ.name}
                  </Badge>
                ))}
              </div>
            </PostCard.Footer>
          </div>
        </div>
      </Link>
    </PostCard>
  );
}
