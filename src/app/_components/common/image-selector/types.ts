export type SelectedImage = {
  id?: string;
  local_id?: string;
  file?: File;
  url: string;
  name?: string;
  size?: number;
};

export interface ImageSelectorProps {
  value?: SelectedImage[];
  maxFiles?: number;
  onChange?:(images: SelectedImage) =>Promise<SelectedImage> ;
  onRemove?: (id: string) => Promise<void>;
  onReplace?: (img: SelectedImage) => Promise<void>;
  accept?: string;
  multiple?: boolean;
  title?:string;
  gridCols?: number;
  crop?: {
    width: number;
    height: number;
    shape?: "rect" | "round";
  };
}

export interface CropDialogProps {
  file: File;
  cropConfig: {
    width: number;
    height: number;
    shape?: "rect" | "round";
  };
  onCancel: () => void;
  onComplete: (file: File) => Promise<void>;
}
