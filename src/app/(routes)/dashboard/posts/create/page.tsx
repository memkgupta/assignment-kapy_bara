import MarkdownEditor from "@/app/_components/editor/MarkDownEditor";
import { CreatePostForm } from "@/app/_components/posts/CreatePostForm";
import { serverClient } from "@/app/_trpc/server_client";

export default async function CreatePost() {
  const categories = await serverClient.categories.all();
  return (
    <div className="p-12">
      {categories && <CreatePostForm categories={categories} />}
    </div>
  );
}
