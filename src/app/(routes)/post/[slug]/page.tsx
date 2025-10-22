import { serverClient } from "@/app/_trpc/server_client";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
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
  const renderMarkdown = (text: string): string => {
    let html = text;

    // Headers
    html = html.replace(
      /^### (.*$)/gim,
      '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>',
    );
    html = html.replace(
      /^## (.*$)/gim,
      '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>',
    );
    html = html.replace(
      /^# (.*$)/gim,
      '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>',
    );

    // Bold
    html = html.replace(
      /\*\*(.+?)\*\*/g,
      '<strong class="font-bold">$1</strong>',
    );

    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');

    // Links
    html = html.replace(
      /\[([^\]]+)\]\(([^\)]+)\)/g,
      '<a href="$2" class="text-blue-600 hover:underline">$1</a>',
    );

    // Images
    html = html.replace(
      /!\[([^\]]*)\]\(([^\)]+)\)/g,
      '<img src="$2" alt="$1" class="max-w-full h-auto my-4 rounded" />',
    );

    // Code blocks
    html = html.replace(
      /```(\w+)?\n([\s\S]*?)```/g,
      '<pre class="bg-gray-800 text-gray-100 p-4 rounded my-4 overflow-x-auto"><code>$2</code></pre>',
    );

    // Inline code
    html = html.replace(
      /`(.+?)`/g,
      '<code class="bg-gray-200 px-2 py-1 rounded text-sm">$1</code>',
    );

    // Unordered lists
    html = html.replace(/^\- (.+)$/gim, '<li class="ml-6">$1</li>');
    html = html.replace(
      /(<li class="ml-6">.*<\/li>)/s,
      '<ul class="list-disc my-2">$1</ul>',
    );

    // Ordered lists
    html = html.replace(/^\d+\. (.+)$/gim, '<li class="ml-6">$1</li>');

    // Line breaks
    html = html.replace(/\n\n/g, '</p><p class="mb-4">');
    html = '<p class="mb-4">' + html + "</p>";

    return html;
  };
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
          <p className="text-base md:text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            {description}
          </p>
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
