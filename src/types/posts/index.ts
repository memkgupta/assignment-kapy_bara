import { Post } from "@/db/schema/post";
export interface PostWithAddOns {
  post: Post;
}

export type PostWith<T extends object> = PostWithAddOns & T;
export type PostWithCategories = PostWith<{
  categories: { name: string; slug: string }[];
}>;
