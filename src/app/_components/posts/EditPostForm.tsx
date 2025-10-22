"use client";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createPostSchema } from "@/db/schema/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod/v4";
import MarkdownEditor from "../editor/MarkDownEditor";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useState } from "react";
import ImageSelector from "../common/image-selector/ImageSelector";
import { toast } from "sonner";
import { PostWithCategories } from "@/types/posts";
import { Category, selectCategorySchema } from "@/db/schema/categories";
import { CategorySelector } from "./CategorySelector";
import { useMutation } from "@tanstack/react-query";
import { trpc } from "@/app/_trpc/client";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { cryptoRandomId } from "../common/image-selector/utils";

export const EditPostForm = ({
  data,
  allCategs,
}: {
  data: PostWithCategories;
  allCategs: Category[];
}) => {
  const { post, categories } = data;

  const formSchema = createPostSchema.extend({
    description: z.string().min(100).optional(),
    title: z.string().min(20),
    slug: z.string().min(20).optional(),
    thumbnail: z.string().optional(),
    banner: z.string().optional(),
    published: z.boolean(),
    categories: z.array(selectCategorySchema).min(1),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      thumbnail: post.thumbnail ?? undefined,
      banner: post.banner ?? undefined,
      title: post.title,
      categories: categories,
      description: post.description ?? undefined,
      content: post.content,
      slug: post.slug,
      published: post.published ?? false,
    },
  });

  const router = useRouter();
  const [submitting, setIsSubmitting] = useState(false);

  const updatePostMutation = useMutation(
    trpc.posts.update.mutationOptions({
      onSuccess: (data) => {
        toast.success("Post saved successfully");
        router.refresh();
      },
      onError: (err) => {
        toast.error(err.shape?.message ?? "Failed to save post");
      },
    }),
  );

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    await updatePostMutation.mutateAsync({
      id: post.id,
      content: data.content,
      title: data.title,
      categories: data.categories,
      description: data.description ?? "",
      slug: data.slug ?? "",
      banner: data.banner ?? null,
      thumbnail: data.thumbnail ?? null,

      published: data.published,
    });
    setIsSubmitting(false);
  }

  return (
    <Card className="mx-auto w-full max-w-5xl shadow-lg border border-gray-200 dark:border-gray-800 bg-background p-4 sm:p-6 md:p-8 rounded-2xl">
      <CardHeader className="pb-4 border-b border-border/50">
        <CardTitle className="text-3xl font-semibold text-center">
          ✏️ Edit Post
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        <form
          id="edit-post-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-10"
        >
          <FieldGroup className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Section */}
              <div className="flex flex-col gap-6">
                {/* Title */}
                <Controller
                  name="title"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      className="space-y-2"
                    >
                      <FieldLabel className="text-sm font-semibold text-muted-foreground">
                        Post Title
                      </FieldLabel>
                      <Input
                        {...field}
                        placeholder="Enter post title"
                        className="text-lg font-medium border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary/50"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Slug */}
                <Controller
                  name="slug"
                  control={form.control}
                  render={({ field }) => (
                    <Field className="space-y-2">
                      <FieldLabel className="text-sm font-semibold text-muted-foreground">
                        Post Slug
                      </FieldLabel>
                      <Input
                        {...field}
                        placeholder="Unique slug (optional)"
                        className="border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary/50"
                      />
                    </Field>
                  )}
                />

                {/* Description */}
                <Controller
                  name="description"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field className="space-y-2">
                      <FieldLabel className="text-sm font-semibold text-muted-foreground">
                        Description
                      </FieldLabel>
                      <Textarea
                        {...field}
                        placeholder="Short summary..."
                        rows={5}
                        className="resize-none border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary/50"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Categories */}
                <Controller
                  name="categories"
                  control={form.control}
                  render={({ field }) => (
                    <Field className="space-y-2">
                      <FieldLabel className="text-sm font-semibold text-muted-foreground">
                        Categories
                      </FieldLabel>
                      <CategorySelector
                        categories={allCategs}
                        selected={field.value}
                        onChange={(val) => {
                          form.setValue("categories", val);
                        }}
                        preview
                      />
                    </Field>
                  )}
                />

                {/* Publish Toggle */}
                <Controller
                  name="published"
                  control={form.control}
                  render={({ field }) => (
                    <div className="flex items-center gap-3 pt-2">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="publish-toggle"
                      />
                      <label
                        htmlFor="publish-toggle"
                        className="text-sm font-medium text-muted-foreground"
                      >
                        {field.value ? "Published" : "Draft"}
                      </label>
                    </div>
                  )}
                />
              </div>

              {/* Right Section */}
              <div className="flex flex-col gap-6">
                {/* Thumbnail */}
                <Controller
                  name="thumbnail"
                  control={form.control}
                  render={({ field }) => (
                    <Field className="space-y-3">
                      <FieldLabel className="text-sm font-semibold text-muted-foreground">
                        Post Thumbnail
                      </FieldLabel>
                      <ImageSelector
                        maxFiles={1}
                        value={
                          field.value
                            ? [{ local_id: cryptoRandomId(), url: field.value }]
                            : undefined
                        }
                        gridCols={1}
                        crop={{ shape: "rect", width: 200, height: 200 }}
                        onChange={async (img) => {
                          field.onChange(img.url);
                          return img;
                        }}
                        onRemove={async () => field.onChange(undefined)}
                      />
                    </Field>
                  )}
                />

                {/* Banner */}
                <Controller
                  name="banner"
                  control={form.control}
                  render={({ field }) => (
                    <Field className="space-y-3">
                      <FieldLabel className="text-sm font-semibold text-muted-foreground">
                        Post Banner
                      </FieldLabel>
                      <ImageSelector
                        maxFiles={1}
                        gridCols={1}
                        value={
                          field.value
                            ? [{ url: field.value, local_id: cryptoRandomId() }]
                            : undefined
                        }
                        crop={{ shape: "rect", width: 600, height: 300 }}
                        onChange={async (img) => {
                          field.onChange(img.url);
                          return img;
                        }}
                        onRemove={async () => field.onChange(undefined)}
                      />
                    </Field>
                  )}
                />
              </div>
            </div>

            {/* Markdown Editor */}
            <div className="space-y-4">
              <FieldLabel className="text-sm font-semibold text-muted-foreground">
                Post Content
              </FieldLabel>
              <div className="border border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                <MarkdownEditor
                  value={form.watch("content")}
                  onChange={(v) => form.setValue("content", v)}
                />
              </div>
            </div>
          </FieldGroup>

          {/* Save Button */}
          <div className="pt-6 flex justify-end">
            <Button
              type="submit"
              disabled={submitting}
              className="px-8 py-2 text-base font-medium rounded-md shadow-sm hover:shadow-md transition-all"
            >
              {submitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
