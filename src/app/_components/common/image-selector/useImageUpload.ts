import { useState } from "react";
import { SelectedImage } from "./types";
import { cryptoRandomId } from "./utils";
import { useUploadThing } from "@/app/_components/utils/Uploadthing";

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const { startUpload } = useUploadThing("imageUploader", {
    onUploadBegin: () => {
      setIsUploading(true);
    },
    onUploadError: (error) => {
      setIsUploading(false);
      throw error;
    },
    onClientUploadComplete: () => {
      setIsUploading(false);
    },
  });

  const uploadImage = async (file: File): Promise<SelectedImage> => {
    setIsUploading(true);
    try {
      const uploadedFiles = await startUpload([file]);

      if (!uploadedFiles || uploadedFiles.length === 0) {
        throw new Error("Upload failed");
      }

      const uploadedFile = uploadedFiles[0];

      return {
        local_id: cryptoRandomId(),
        url: uploadedFile.url,
        name: uploadedFile.name,
        size: uploadedFile.size,
      };
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadImage, isUploading };
}
