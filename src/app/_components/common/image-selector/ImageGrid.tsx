"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { ImageCard } from "./ImageCard";
import { SelectedImage } from "./types";

interface ImageGridProps {
  images: SelectedImage[];
  onRemove: (id: string) => void;
  onReplace: (id: string, file: File) => void;
  cols?: number;
}

export function ImageGrid({
  images,
  onRemove,
  onReplace,
  cols = 3,
}: ImageGridProps) {
  const gridCols = `grid-cols-${Math.min(Math.max(cols, 1), 6)}`;

  return (
    <div id="img-grid" className={cn("grid gap-4", gridCols)}>
      {images.map((img) => (
        <ImageCard
          key={img.id || img.local_id}
          img={img}
          onRemove={onRemove}
          onReplace={onReplace}
        />
      ))}
    </div>
  );
}
