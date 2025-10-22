"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { useState, useEffect } from "react";
type Category = {
  id: number;
  name: string;
  slug: string;
};

interface CategorySelectorProps {
  categories: Category[];
  preview?: boolean;
  selected: Category[];
  onChange: (selected: Category[]) => void;
}

export function CategorySelector({
  categories,
  preview,
  selected,
  onChange,
}: CategorySelectorProps) {
  const [open, setOpen] = React.useState(false);

  const toggleCategory = (category: Category) => {
    if (selected.find((s) => s.slug === category.slug)) {
      onChange(selected.filter((s) => s.slug !== category.slug));
    } else {
      onChange([...selected, category]);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between"
          >
            {selected.length > 0
              ? `${selected.length} categor${selected.length > 1 ? "ies" : "y"} selected`
              : "Select categories"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0">
          <Command>
            <CommandInput placeholder="Search categories..." />
            <CommandList>
              <CommandEmpty>No categories found.</CommandEmpty>
              <CommandGroup>
                {categories.map((category) => {
                  const isSelected = selected.some((s) => s.id === category.id);
                  return (
                    <CommandItem
                      key={category.id}
                      onSelect={() => toggleCategory(category)}
                    >
                      <Check
                        className={`mr-2 h-4 w-4 ${
                          isSelected ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      {category.name}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected categories badges */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((cat) => (
            <Badge
              key={cat.id}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {cat.name}
              <X
                onClick={() => toggleCategory(cat)}
                className="h-3 w-3 cursor-pointer"
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
