import { nanoid } from "nanoid";
export function generateUniqueSlug(title: string) {
  const cleanTitle = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

  return `${cleanTitle}-${nanoid(5)}`;
}
