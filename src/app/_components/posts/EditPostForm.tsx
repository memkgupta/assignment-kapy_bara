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
import { TRPCClientError } from "@trpc/client";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PostWithCategories } from "@/types/posts";
import {
  Category,
  createCategorySchema,
  selectCategorySchema,
} from "@/db/schema/categories";
import { CategorySelector } from "./CategorySelector";
import { useMutation } from "@tanstack/react-query";

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
    },
  });
  const router = useRouter();
  const [submitting, setIsSubmitting] = useState(false);
  const createPostMutation = useMutation(
    trpc.posts.update.mutationOptions({
      onSuccess: (data) => {
        if (data) {
          toast.success("Blog post updated");
        }
      },
      onError: (data) => {
        const message = data.shape?.message ?? "Something went wrong";
        toast.error(message);
      },
    }),
  );
  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    await createPostMutation.mutateAsync({
      id: post.id,
      content: data.content,
      title: data.title,
      description: data.description,
      slug: data.slug ?? "",
      banner: data.banner,
      thumbnail: data.thumbnail,
    });

    setIsSubmitting(false);
  }

  return (
    <Card className="mx-auto w-full max-w-5xl shadow-lg border border-gray-200 dark:border-gray-800 bg-background p-4 sm:p-6 md:p-8 rounded-2xl">
      <CardHeader className="pb-4 border-b border-border/50">
        <CardTitle className="text-3xl font-semibold text-center">
          ✏️ Update Post
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        <form
          id="create-post-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-10"
        >
          <FieldGroup className="space-y-8">
            {/* Top Section */}
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
                      <FieldLabel
                        htmlFor="form-title"
                        className="text-sm font-semibold text-muted-foreground"
                      >
                        Post Title
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-title"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter a catchy title for your post"
                        autoComplete="off"
                        className="text-lg font-medium focus:ring-2 focus:ring-primary/50 focus:border-primary border border-gray-300 dark:border-gray-700"
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
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      className="space-y-2"
                    >
                      <FieldLabel
                        htmlFor="form-slug"
                        className="text-sm font-semibold text-muted-foreground"
                      >
                        Post Slug
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-slug"
                        value={field.value ?? ""}
                        aria-invalid={fieldState.invalid}
                        placeholder="Unique slug for the post (optional)"
                        className="focus:ring-2 focus:ring-primary/50 focus:border-primary border border-gray-300 dark:border-gray-700"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Description */}
                <Controller
                  name="description"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      className="space-y-2"
                    >
                      <FieldLabel
                        htmlFor="form-description"
                        className="text-sm font-semibold text-muted-foreground"
                      >
                        Post Description
                      </FieldLabel>
                      <Textarea
                        {...field}
                        id="form-description"
                        value={field.value ?? ""}
                        placeholder="Brief summary of your post..."
                        rows={5}
                        className="resize-none focus:ring-2 focus:ring-primary/50 focus:border-primary border border-gray-300 dark:border-gray-700"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="categories"
                  control={form.control}
                  render={({ field }) => (
                    <Field className="space-y-2">
                      <FieldLabel className="text-sm font-semibold text-muted-foreground">
                        Categories
                      </FieldLabel>

                      <CategorySelector
                        categories={allCategs} // fetched from your server
                        selected={field.value || []}
                        onChange={(newValue) => field.onChange(newValue)}
                      />
                    </Field>
                  )}
                />
              </div>

              {/* Right Section: Image Uploads */}
              <div className="flex flex-col gap-6">
                <Controller
                  name="thumbnail"
                  control={form.control}
                  render={({ field }) => (
                    <Field className="space-y-3">
                      <FieldLabel className="text-sm font-semibold text-muted-foreground">
                        Post Thumbnail
                      </FieldLabel>
                      <div className="border border-dashed border-gray-400 dark:border-gray-700 rounded-xl p-4 flex items-center justify-center bg-muted/5 hover:bg-muted/10 transition">
                        <ImageSelector
                          maxFiles={1}
                          gridCols={1}
                          crop={{ shape: "rect", width: 200, height: 200 }}
                          onChange={async (img) => {
                            field.onChange(img.url);
                            return img;
                          }}
                          onRemove={async () => field.onChange(undefined)}
                        />
                      </div>
                    </Field>
                  )}
                />

                <Controller
                  name="banner"
                  control={form.control}
                  render={({ field }) => (
                    <Field className="space-y-3">
                      <FieldLabel className="text-sm font-semibold text-muted-foreground">
                        Post Banner
                      </FieldLabel>
                      <div className="border border-dashed border-gray-400 dark:border-gray-700 rounded-xl p-4 flex items-center justify-center bg-muted/5 hover:bg-muted/10 transition">
                        <ImageSelector
                          maxFiles={1}
                          gridCols={1}
                          crop={{ shape: "rect", width: 600, height: 300 }}
                          onChange={async (img) => {
                            field.onChange(img.url);
                            return img;
                          }}
                          onRemove={async () => field.onChange(undefined)}
                        />
                      </div>
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
                  onChange={(value) => form.setValue("content", value)}
                />
              </div>
            </div>
          </FieldGroup>

          {/* Submit Button */}
          <div className="pt-6 flex flex-col sm:flex-row justify-end">
            <Button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-8 py-2 text-base font-medium rounded-md shadow-sm hover:shadow-md transition-all"
            >
              {submitting ? "Uploading..." : "Publish Post"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
