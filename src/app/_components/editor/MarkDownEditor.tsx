"use client";
import React, { useState, useRef, ChangeEvent } from "react";
import {
  Bold,
  Italic,
  Link,
  List,
  ListOrdered,
  Code,
  Eye,
  EyeOff,
  Image,
  LucideIcon,
} from "lucide-react";

interface ToolbarButton {
  icon: LucideIcon;
  action: () => void;
  label: string;
}

interface EditorStats {
  characters: number;
  words: number;
}

const MarkdownEditor = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (text: string) => void;
}) => {
  const [content, setContent] = useState<string>(value);
  const [showPreview, setShowPreview] = useState<boolean>(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertMarkdown = (before: string, after: string = ""): void => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText =
      content.substring(0, start) +
      before +
      selectedText +
      after +
      content.substring(end);

    setContent(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

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

  const calculateStats = (): EditorStats => {
    return {
      characters: content.length,
      words: content.split(/\s+/).filter((w) => w).length,
    };
  };

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    onChange(e.target.value);
    setContent(e.target.value);
  };

  const toolbarButtons: ToolbarButton[] = [
    { icon: Bold, action: () => insertMarkdown("**", "**"), label: "Bold" },
    { icon: Italic, action: () => insertMarkdown("*", "*"), label: "Italic" },
    { icon: Link, action: () => insertMarkdown("[", "](url)"), label: "Link" },
    {
      icon: Image,
      action: () => insertMarkdown("![alt](", ")"),
      label: "Image",
    },
    { icon: List, action: () => insertMarkdown("- "), label: "List" },
    {
      icon: ListOrdered,
      action: () => insertMarkdown("1. "),
      label: "Ordered List",
    },
    { icon: Code, action: () => insertMarkdown("`", "`"), label: "Code" },
  ];

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}

          {/* Toolbar */}
          <div className="border-b bg-gray-50 p-3 flex items-center gap-2 flex-wrap">
            {toolbarButtons.map((btn, idx) => (
              <button
                key={idx}
                onClick={btn.action}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title={btn.label}
                type="button"
              >
                <btn.icon size={20} className="text-gray-700" />
              </button>
            ))}
          </div>

          {/* Editor Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-x">
            {/* Editor */}
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-3 text-gray-700">
                Editor
              </h2>
              <textarea
                ref={textareaRef}
                value={content}
                onChange={handleContentChange}
                className="w-full h-96 p-4 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Write your markdown here..."
              />
            </div>

            {/* Preview */}
            {showPreview && (
              <div className="p-6 bg-gray-50">
                <h2 className="text-lg font-semibold mb-3 text-gray-700">
                  Preview
                </h2>
                <div
                  className="prose max-w-none bg-white p-6 rounded-lg border min-h-96 overflow-auto"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
                />
              </div>
            )}
          </div>

          {/* Footer Stats */}
          <div className="border-t bg-gray-50 p-4 text-sm text-gray-600 flex justify-between">
            <span>{stats.characters} characters</span>
            <span>{stats.words} words</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
