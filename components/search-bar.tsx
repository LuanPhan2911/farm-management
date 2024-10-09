"use client";
import { useDebounceCallback } from "usehooks-ts";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { useUpdateSearchParam } from "@/hooks/use-update-search-param";
interface SearchBarProps {
  placeholder: string;
  isPagination?: boolean;
  className?: string;
}
export const SearchBar = ({
  placeholder,
  isPagination,
  className,
}: SearchBarProps) => {
  const searchParams = useSearchParams();

  const { updateSearchParam: updateQuery } = useUpdateSearchParam("query");
  const { updateSearchParam: updatePage } = useUpdateSearchParam("page");
  const handleSearch = useDebounceCallback((term: string) => {
    if (isPagination) {
      updatePage("1");
    }
    updateQuery(term);
  }, 300);
  return (
    <div className={cn("relative lg:w-[250px] w-full", className)}>
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className="pl-8 h-9"
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams!.get("query")?.toString()}
      />
    </div>
  );
};
