"use client";
import { useRouter, useSearchParams } from "next/navigation";

export const CursorPagination = ({
  prev,
  next,
}: {
  prev: number;
  next: number;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex justify-center gap-4 mt-6">
      <button
        onClick={() => handlePageChange(prev)}
        disabled={prev === -1}
        className={`px-4 py-2 rounded-md border ${
          prev === -1
            ? "cursor-not-allowed opacity-50 bg-gray-100"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        ← Previous
      </button>

      <button
        onClick={() => handlePageChange(next)}
        disabled={next === -1}
        className={`px-4 py-2 rounded-md border ${
          next === -1
            ? "cursor-not-allowed opacity-50 bg-gray-100"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        Next →
      </button>
    </div>
  );
};
