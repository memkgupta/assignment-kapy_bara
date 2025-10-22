export function toObjectUrl(file: File): string {
  return URL.createObjectURL(file);
}

export function cryptoRandomId(): string {
  return Math.random().toString(36).slice(2, 9);
}

export async function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
  });
}