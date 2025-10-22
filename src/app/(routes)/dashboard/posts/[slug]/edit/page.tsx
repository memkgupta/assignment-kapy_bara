import { EditPostForm } from "@/app/_components/posts/EditPostForm";
import { serverClient } from "@/app/_trpc/server_client";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await serverClient.posts.bySlug({ slug });
  const categories = await serverClient.categories.all();
  return (
    <>{categories && <EditPostForm allCategs={categories} data={post} />}</>
  );
}
