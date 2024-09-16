"use client";
import { usePathname, useRouter } from "@/navigation";
import { useDebounceCallback } from "usehooks-ts";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
interface SearchBarProps {
  placeholder: string;
  isPagination?: boolean;
}
export const SearchBar = ({ placeholder, isPagination }: SearchBarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const handleSearch = useDebounceCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (isPagination) {
      params.set("page", "1");
    }

    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }

    router.replace(`${pathname}?${params.toString()}`);
  }, 300);
  return (
    <div className="relative lg:w-[250px] w-full">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className="pl-8 h-8"
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("query")?.toString()}
      />
    </div>
  );
};
