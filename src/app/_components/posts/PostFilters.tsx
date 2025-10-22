"use client";

import { Category } from "@/db/schema/categories";
import { CategorySelector } from "./CategorySelector";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function PostFilters({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const params = new URLSearchParams(searchParams.toString());
  const categoryFilter = (categs: string[]) => {
    params.delete("categs");
    console.log(categs);
    for (const t of categs) {
      params.append("categs", t);
    }

    router.push(`?${params.toString()}`);
  };

  const handleParamChange = (param_name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(param_name, String(value));
    router.push(`${pathName}?${params.toString()}`);
  };
  const [search, setSearch] = useState("");
  const handleSearchClick = () => {
    handleParamChange("search", search);
  };
  return (
    <>
      <div className="flex gap-2 justify-around">
        <CategorySelector
          selected={categories.filter((c) =>
            params.getAll("categs").includes(c.slug),
          )}
          preview={true}
          categories={categories}
          onChange={(v) => {
            categoryFilter(v.map((_v) => _v.slug));
          }}
        />
        <div className="flex gap-2 items-center">
          <Input onChange={(v) => setSearch(v.target.value)} />{" "}
          <Button type="button" onClick={handleSearchClick}>
            Search
          </Button>
        </div>
      </div>
    </>
  );
}
