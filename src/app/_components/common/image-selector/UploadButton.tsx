"use client";
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";

interface UploadButtonProps {
  accept?: string;
  multiple?: boolean;
  onFiles: (files: FileList | null) => void;
}

export function UploadButton({
  accept = "image/*",
  multiple = true,
  onFiles,
}: UploadButtonProps) {
  const ref = useRef<HTMLInputElement | null>(null);

  return (
    <>
      <input
        ref={ref}
        type="file"
        className="hidden"
        accept={accept}
        multiple={multiple}
        onChange={(e) => onFiles(e.target.files)}
      />
      <Button type="button" onClick={() => ref.current?.click()}>
        Upload
      </Button>
    </>
  );
}
