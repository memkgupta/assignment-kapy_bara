"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ImageGrid } from "./ImageGrid";
import { CropDialog } from "./CropDialog";
import { useImageUpload } from "./useImageUpload";
import { ImageSelectorProps, SelectedImage } from "./types";
import { UploadButton } from "./UploadButton";

export default function ImageSelector({
  value = [],
  maxFiles = 6,
  onChange,
  onRemove,
  title,
  onReplace,
  accept = "image/*",
  multiple = true,
  gridCols = 3,
  crop,
}: ImageSelectorProps) {
  const [images, setImages] = useState<SelectedImage[]>(value);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [replaceId, setReplaceId] = useState<string | null>(null);
  const { uploadImage, isUploading } = useImageUpload();

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const file = files[0];

    if (crop) {
      setCropFile(file);
      return;
    }

    addImage(file);
  };

  const addImage = async (file: File) => {
    try {
      let newImg = await uploadImage(file);
      const changed = await onChange?.(newImg);
      if (changed) {
        newImg = changed;
      }
      const next = [...images, newImg].slice(0, maxFiles);
      setImages(next);
      console.log(next);
    } catch (error) {
      console.error("Failed to upload image:", error);
    }
  };

  const handleRemove = async (id: string) => {
    const next = images.filter((v) => v.local_id !== id);
    setImages(next);
    await onRemove?.(id);
  };

  const handleReplace = async (id: string, file: File) => {
    console.log("Replace called");
    if (crop) {
      setReplaceId(id);
      setCropFile(file);
      return;
    }
  };

  const handleCropComplete = async (file: File) => {
    try {
      if (replaceId) {
        try {
          const updatedImg = await uploadImage(file);
          const newImg: SelectedImage = {
            ...updatedImg,
            id: replaceId,
            local_id: replaceId,
            name: file.name,
            size: file.size,
          };

          const next = images.map((v) =>
            v.local_id === replaceId ? newImg : v,
          );
          setImages(next);
          await onReplace?.(newImg);
        } catch (error) {
          console.error("Failed to replace image:", error);
        }
        setReplaceId(null);
      } else {
        await addImage(file);
      }
    } finally {
      setCropFile(null);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title ? title : "Images"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4 ">
          {images.length < maxFiles && (
            <UploadButton
              accept={accept}
              multiple={multiple}
              onFiles={handleFiles}
            />
          )}
          <div className="text-sm text-muted-foreground">
            {images.length}/{maxFiles} selected
          </div>
          {isUploading && (
            <div className="text-sm text-blue-600">Uploading...</div>
          )}
        </div>

        {images.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No images selected
          </div>
        ) : (
          <ImageGrid
            images={images}
            onRemove={handleRemove}
            onReplace={handleReplace}
            cols={gridCols}
          />
        )}

        {cropFile && crop && (
          <CropDialog
            file={cropFile}
            cropConfig={crop}
            onCancel={() => setCropFile(null)}
            onComplete={handleCropComplete}
          />
        )}
      </CardContent>
    </Card>
  );
}
