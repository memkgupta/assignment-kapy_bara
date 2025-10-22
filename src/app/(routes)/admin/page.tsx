"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { serverClient } from "@/app/_trpc/server_client";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm, Controller } from "react-hook-form";
import { trpc } from "@/app/_trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type Category = {
  id: number;
  name: string;
  slug: string;
};

export default function AdminDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data: categories, isFetching: loading } = useQuery(
    trpc.categories.all.queryOptions(),
  );
  const queryKey = trpc.categories.all.queryKey();
  const addCategoryMutation = useMutation(
    trpc.categories.add.mutationOptions({
      onSuccess: (data) => {
        toast.success("Category added");
        queryClient.fetchQuery({
          queryKey: queryKey,
        });
        setAddDialogOpen(false);
        addForm.reset();
      },
      onError: (error) => {
        const message = error.shape?.message ?? "Something went wrong";
        toast.error(message);
      },
    }),
  );
  const updateCategoryMutation = useMutation(
    trpc.categories.add.mutationOptions({
      onSuccess: (data) => {
        toast.success("Category updated");
        queryClient.fetchQuery({
          queryKey: queryKey,
        });
        setUpdateDialogOpen(false);
        updateForm.reset();
      },
      onError: (error) => {
        const message = error.shape?.message ?? "Something went wrong";
        toast.error(message);
      },
    }),
  );
  // Add Category form
  const addForm = useForm<{ name: string; slug: string }>();
  const updateForm = useForm<{ name: string; slug: string }>();

  const onAddCategory = async (data: { name: string; slug: string }) => {
    await addCategoryMutation.mutateAsync(data);
  };

  const onUpdateCategory = async (data: { name: string; slug: string }) => {
    if (!selectedCategory) return;
    await updateCategoryMutation.mutateAsync(data);
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold">Admin Dashboard</h1>

      {/* Categories Management */}
      <Card className="shadow-lg">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Categories</CardTitle>
          {/* Add Category Button */}
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Category</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={addForm.handleSubmit(onAddCategory)}
                className="space-y-4 mt-4"
              >
                <Controller
                  name="name"
                  control={addForm.control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input {...field} placeholder="Category Name" />
                  )}
                />
                <Controller
                  name="slug"
                  control={addForm.control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input {...field} placeholder="Slug" />
                  )}
                />
                <Button type="submit" className="w-full">
                  Create Category
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>

        {categories && (
          <CardContent className="flex flex-wrap gap-2">
            {loading ? (
              <p>Loading...</p>
            ) : categories.length === 0 ? (
              <p>No categories found</p>
            ) : (
              categories.map((cat) => (
                <div key={cat.id} className="flex items-center gap-2">
                  <Badge variant="secondary" className="capitalize">
                    {cat.name}
                  </Badge>
                  {/* Edit Category Button */}
                  <Dialog
                    open={updateDialogOpen && selectedCategory?.id === cat.id}
                    onOpenChange={setUpdateDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedCategory(cat);
                          updateForm.reset({ name: cat.name, slug: cat.slug });
                          setUpdateDialogOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                      </DialogHeader>
                      <form
                        onSubmit={updateForm.handleSubmit(onUpdateCategory)}
                        className="space-y-4 mt-4"
                      >
                        <Controller
                          name="name"
                          control={updateForm.control}
                          render={({ field }) => (
                            <Input {...field} placeholder="Category Name" />
                          )}
                        />
                        <Controller
                          name="slug"
                          control={updateForm.control}
                          render={({ field }) => (
                            <Input {...field} placeholder="Slug" />
                          )}
                        />
                        <Button type="submit" className="w-full">
                          Update Category
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              ))
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
