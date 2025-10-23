"use client";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Post } from "@/db/schema/post";
import { queryClient, trpc } from "@/app/_trpc/client";
import { toast } from "sonner";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

export default function DeletePostDialog({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const deletePostMutation = useMutation(
    trpc.posts.delete.mutationOptions({
      onSuccess: async () => {
        toast.success("Post deleted successfully");
        queryClient.setQueryData(trpc.posts.all.queryKey(), (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            posts: oldData.posts.filter((p) => p.post.id !== id),
          };
        });
        setOpen(false);
        setDeleting(false);
      },
      onError: (error) => {
        const message = error.shape?.message || "Something went wrong";
        toast.error(message);
        setDeleting(false);
      },
    }),
  );

  const onConfirm = async () => {
    setDeleting(true);
    await deletePostMutation.mutateAsync({ id: id });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon" className="h-8 w-8">
          <Trash2 className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the post{" "}
            <span className="font-bold">{title}</span> and remove it from our
            servers.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={deleting} onClick={onConfirm}>
            {deleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
