"use client";
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { SelectedImage } from "./types";
import { cn } from "@/lib/utils";

interface ImageCardProps {
  img: SelectedImage;
  onRemove: (id: string) => void;
  onReplace: (id: string, file: File) => void;
}

export function ImageCard({ img, onRemove, onReplace }: ImageCardProps) {
  const ref = useRef<HTMLInputElement | null>(null);

  const handleReplace = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    if (!img.local_id) return;

    onReplace(img.local_id, e.target.files[0]);
  };

  const handleRemove = () => {
    if (img.local_id) {
      onRemove(img.local_id);
    }
  };

  return (
    <div className="relative border rounded-md overflow-hidden w-full h-full">
      <img
        src={img.url}
        alt={img.name ?? "image"}
        className={cn(``, "object-cover w-full h-full")}
      />
      <div className="absolute inset-0 flex items-end justify-between p-2 bg-gradient-to-t from-black/40 to-transparent">
        <div className="text-xs text-white truncate max-w-[70%]">
          {img.name}
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={handleRemove}
          >
            Remove
          </Button>
          <input
            ref={ref}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleReplace}
          />
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => ref.current?.click()}
          >
            Replace
          </Button>
        </div>
      </div>
    </div>
  );
}
