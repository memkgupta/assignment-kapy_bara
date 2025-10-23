import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const renderMarkdown = (text: string): string => {
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

  // Images
  html = html.replace(
    /!\[([^\]]*)\]\(([^\)]+)\)/g,
    '<img src="$2" alt="$1" class="max-w-full h-auto my-4 rounded" />',
  );

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^\)]+)\)/g,
    '<a href="$2" class="text-blue-600 hover:underline">$1</a>',
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
