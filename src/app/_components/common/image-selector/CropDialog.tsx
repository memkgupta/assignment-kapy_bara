"use client";
import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { CropDialogProps } from "./types";
import { createImage } from "./utils";

export function CropDialog({
  file,
  cropConfig,
  onCancel,
  onComplete,
}: CropDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  // Create object URL once
  const [imageUrl, setImageUrl] = useState<string>("");

  React.useEffect(() => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);

    // Cleanup on unmount
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const onCropComplete = useCallback((_: any, areaPixels: any) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const createCroppedImage = async (): Promise<File | undefined> => {
    if (!croppedAreaPixels) return;

    const image = await createImage(imageUrl); // use the memoized URL
    const canvas = document.createElement("canvas");
    canvas.width = cropConfig.width;
    canvas.height = cropConfig.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      cropConfig.width,
      cropConfig.height,
    );

    return new Promise<File>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(new File([blob], file.name, { type: file.type }));
        }
      }, file.type);
    });
  };

  const handleDone = async () => {
    const croppedFile = await createCroppedImage();

    if (croppedFile) await onComplete(croppedFile);
  };

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>
        <div className="relative w-full h-96 bg-black">
          {imageUrl && (
            <Cropper
              image={imageUrl} // use memoized URL
              crop={crop}
              zoom={zoom}
              aspect={cropConfig.width / cropConfig.height}
              cropShape={cropConfig.shape ?? "rect"}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={handleDone}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
