"use client";
import { usePathname, useRouter } from "@/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SortAsc, SortDesc } from "lucide-react";
import { useUpdateSearchParam } from "@/hooks/use-update-search-param";
export type SortByOption = {
  label: string;
  value: string;
};
interface SortByDropdownProps {
  options: SortByOption[];
  label: string;
  placeholder: string;
}
export const SortByDropdown = ({
  options,
  label,
  placeholder,
}: SortByDropdownProps) => {
  const { initialParam, updateSearchParam } = useUpdateSearchParam("orderBy");
  const [value, setValue] = useState(() => {
    return initialParam;
  });

  const handleSort = (option: SortByOption) => {
    const isDesc = value === option.value;
    const updatedValue = isDesc ? `-${option.value}` : option.value;
    updateSearchParam(updatedValue);
    setValue(updatedValue);
  };
  const option = options.find(
    (item) => item.value === value || `-${item.value}` === value
  );
  const isDesc = initialParam?.[0] === "-";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"sm"} variant={"blue"}>
          <span className="font-bold mr-2">{label}</span>
          {option ? (
            <div className="flex gap-x-2 items-center">
              {option.label} {isDesc ? <SortDesc /> : <SortAsc />}
            </div>
          ) : (
            placeholder
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {options.map((item) => {
          return (
            <DropdownMenuItem key={item.value} onClick={() => handleSort(item)}>
              {item.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
