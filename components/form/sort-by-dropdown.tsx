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
export type SortByOption = {
  label: string;
  value: string;
};
interface SortByDropdownProps {
  options: SortByOption[];
  defaultValue?: string;
  label: string;
  placeholder: string;
}
export const SortByDropdown = ({
  options,
  defaultValue,
  label,
  placeholder,
}: SortByDropdownProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [value, setValue] = useState(() => {
    return defaultValue || searchParams.get("orderBy");
  });

  const handleSort = (option: SortByOption) => {
    const params = new URLSearchParams(searchParams);
    const isDesc = value === option.value;
    if (isDesc) {
      setValue(`-${option.value}`);
      params.set("orderBy", `-${option.value}`);
    } else {
      setValue(option.value);
      params.set("orderBy", option.value);
    }

    router.replace(`${pathname}?${params.toString()}`);
  };
  const option = options.find(
    (item) => item.value === value || `-${item.value}` === value
  );
  const isDesc = searchParams.get("orderBy")?.[0] === "-";

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
