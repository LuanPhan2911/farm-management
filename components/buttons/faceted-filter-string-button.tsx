"use client";

import { cn, safeParseJSON } from "@/lib/utils";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Button } from "../ui/button";
import { CheckIcon, LucideIcon, PlusCircleIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { useUpdateSearchParams } from "@/hooks/use-update-search-param";

export type FilterStringValue<T extends unknown> = {
  in?: T[];
  // notIn?: T[];
  // equals?: T;
  // not?: T;
};
export type FilterStringOption<T extends unknown> = {
  label: string;
  value: T;
  icon?: LucideIcon;
};
export type FilterString<T extends unknown> = Record<
  string,
  FilterStringValue<T>
>;
interface FacetedFilterStringButtonProps<T extends unknown> {
  title?: string;
  options: FilterStringOption<T>[];
  column: string;
  counts?: Record<string, number>;
  isPaginated?: boolean;
  pageCursor?: string;
}
export const FacetedFilterStringButton = <T extends unknown>({
  options,
  title,
  column,
  counts,
  isPaginated,
  pageCursor = "1",
}: FacetedFilterStringButtonProps<T>) => {
  const { initialParams, updateSearchParams } = useUpdateSearchParams({
    filterString: undefined,
    page: undefined,
  });
  const filterString = safeParseJSON<FilterString<T>>(
    initialParams.filterString
  ) || {
    [column]: {
      in: undefined,
    },
  };
  const selectedValues = new Set(
    filterString ? filterString[column].in : undefined
  );

  const handlePushUrl = (values: T[] | undefined) => {
    let updatedPage = isPaginated ? pageCursor : undefined;
    let updatedFilterString = { ...filterString };

    if (!values || !values.length) {
      updateSearchParams({
        filterString: undefined,
        page: updatedPage,
      });
    } else {
      updatedFilterString[column].in = values;
      updateSearchParams({
        filterString: JSON.stringify(updatedFilterString),
        page: updatedPage,
      });
    }
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-dashed justify-start"
        >
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.label}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.label}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value);
                      } else {
                        selectedValues.add(option.value);
                      }
                      const filterValues = Array.from(selectedValues);
                      handlePushUrl(
                        filterValues.length ? filterValues : undefined
                      );
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <CheckIcon className={cn("h-4 w-4")} />
                    </div>
                    {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>

                    <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                      {counts?.[option.value as string] || 0}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => handlePushUrl(undefined)}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
