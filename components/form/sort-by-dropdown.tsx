import { usePathname, useRouter } from "@/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
export type SortByOption = {
  label: string;
  value: string;
};
interface SortByDropdownProps {
  options: SortByOption[];
  defaultValue?: string;
}
export const SortByDropdown = ({
  options,
  defaultValue,
}: SortByDropdownProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleSort = (option: SortByOption) => {
    const params = new URLSearchParams(searchParams);
    params.set("orderBy", option.value);
    router.replace(`${pathname}?${params.toString()}`);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"sm"} variant={"blue"}>
          <span className="font-bold mr-2">Sort by: </span>
          {options.find((option) => option.value === defaultValue)?.label ||
            "Select sort by"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {options.map((option) => {
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleSort(option)}
            >
              {option.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
