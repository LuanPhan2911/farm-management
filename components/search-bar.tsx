"use client";
import { useDebounceCallback } from "usehooks-ts";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { useUpdateSearchParams } from "@/hooks/use-update-search-param";
interface SearchBarProps {
  placeholder: string;
  isPagination?: boolean;
  pageCursor?: string;
  className?: string;
  inputClassName?: string;
}
export const SearchBar = ({
  placeholder,
  isPagination,
  className,
  inputClassName,
  pageCursor = "1",
}: SearchBarProps) => {
  const { initialParams, updateSearchParams } = useUpdateSearchParams({
    query: undefined,
    page: undefined,
  });
  const handleSearch = useDebounceCallback((term: string) => {
    const updatedPage = isPagination ? pageCursor : undefined;
    updateSearchParams({
      page: updatedPage,
      query: term,
    });
  }, 300);
  return (
    <div className={cn("relative lg:w-[250px] w-full", className)}>
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className={cn("pl-8 h-10", inputClassName)}
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={initialParams.query}
      />
    </div>
  );
};
