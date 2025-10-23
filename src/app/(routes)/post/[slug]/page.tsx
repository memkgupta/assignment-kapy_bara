import { serverClient } from "@/app/_trpc/server_client";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { renderMarkdown } from "@/lib/utils";
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const formatDate = (date: string | Date) =>
    new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const { slug } = await params;
  const post = await serverClient.posts.bySlug({ slug: slug });
  console.log(post);
  const { title, description, banner, thumbnail, content, createdAt } =
    post.post;

  return (
    <article className="mx-auto w-full max-w-4xl px-4 sm:px-6 md:px-8 py-10">
      {/* Title Section */}
      <header className="space-y-2 text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold leading-tight">
          {title}
        </h1>
        {createdAt && (
          <p className="text-muted-foreground text-sm">
            Published on {formatDate(createdAt)}
          </p>
        )}
        {/* Banner Section */}
        {banner && (
          <div className="relative w-full h-64 sm:h-80 md:h-96 mb-8 overflow-hidden rounded-2xl shadow-md">
            <Image
              src={banner}
              alt={title}
              fill
              className="object-cover object-center"
              priority
            />
          </div>
        )}
        {description && (
          <div className="text-base md:text-lg text-muted-foreground mt-2 max-w-2xl mx-auto break-words whitespace-normal">
            <p>{description}</p>
          </div>
        )}
      </header>

      {/* Thumbnail (optional small image beside content) */}

      {/* Markdown Content */}
      <Card className="prose dark:prose-invert max-w-none px-4 sm:px-6 md:px-8 py-8 border border-gray-200 dark:border-gray-700 shadow-sm rounded-2xl">
        <div
          className="prose max-w-none  min-h-96 overflow-auto"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
        />
      </Card>
    </article>
  );
}
