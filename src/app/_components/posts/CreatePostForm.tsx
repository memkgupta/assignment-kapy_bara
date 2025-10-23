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
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { CategorySelector } from "./CategorySelector";
import { Category, selectCategorySchema } from "@/db/schema/categories";

export const CreatePostForm = ({ categories }: { categories: Category[] }) => {
  const formSchema = createPostSchema.extend({
    description: z.string().min(100).optional(),
    title: z.string().min(20),
    slug: z.string().optional(),
    thumbnail: z.string().optional(),
    banner: z.string().optional(),
    categories: z.array(selectCategorySchema).min(1),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",

      content: "",
      categories: [],
    },
  });

  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const createPostMutation = useMutation(
    trpc.posts.create.mutationOptions({
      onSuccess: (data) => {
        if (data) {
          toast.success("Blog post created");
          router.replace(`/dashboard/posts/${data?.slug}`);
        }
      },
      onError: (err) => {
        toast.error(err.shape?.message ?? "Something went wrong");
      },
    }),
  );

  // 📝 Separate draft saving handler
  const saveDraftMutation = useMutation(
    trpc.posts.create.mutationOptions({
      onSuccess: (data) => {
        toast.success("Draft saved successfully");
        router.replace(`/dashboard/posts/${data?.slug}`);
      },
      onError: (err) => {
        toast.error(err.shape?.message ?? "Failed to save draft");
      },
    }),
  );

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setSubmitting(true);
    try {
      await createPostMutation.mutateAsync({
        content: data.content,
        slug: data.slug,
        categories: data.categories,
        title: data.title,
        banner: data.banner,
        description: data.description,
        thumbnail: data.thumbnail,
        published: true,
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function onSaveDraft() {
    const values = form.getValues();
    setSubmitting(true);
    try {
      await saveDraftMutation.mutateAsync({
        content: values.content,
        slug: values.slug ?? "",
        title: values.title,
        categories: values.categories,
        banner: values.banner,
        description: values.description,
        thumbnail: values.thumbnail,
        published: false,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-5xl shadow-lg border border-gray-200 dark:border-gray-800 bg-background p-4 sm:p-6 md:p-8 rounded-2xl">
      <CardHeader className="pb-4 border-b border-border/50 flex justify-between items-center">
        <CardTitle className="text-3xl font-semibold">
          ✏️ Create a New Post
        </CardTitle>

        {/* 🟡 Buttons in header */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onSaveDraft}
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Save Draft"}
          </Button>
          <Button form="create-post-form" type="submit" disabled={submitting}>
            {submitting ? "Publishing..." : "Publish Post"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <form
          id="create-post-form"
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
                        categories={categories}
                        selected={field.value}
                        onChange={(val) => {
                          form.setValue("categories", val);
                        }}
                        preview
                      />
                    </Field>
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
                  onChange={(value) => form.setValue("content", value)}
                />
              </div>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};
