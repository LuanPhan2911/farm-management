"use client";

import {
  cn,
  getArrayFilterNumber,
  getPostfixValueFilterNumber,
} from "@/lib/utils";

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
import { useState } from "react";
import { useUpdateSearchParam } from "@/hooks/use-update-search-param";
interface FacetedFilterNumberButtonProps {
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: LucideIcon;
  }[];
  column: string;
}
export const FacetedFilterNumberButton = ({
  options,
  title,
  column,
}: FacetedFilterNumberButtonProps) => {
  const { initialParam, updateSearchParam } =
    useUpdateSearchParam("filterNumber");
  const selectedValues = new Set(getArrayFilterNumber(initialParam));

  const [value, setValue] = useState(() => {
    return getPostfixValueFilterNumber(initialParam || "", column);
  });

  const handlePushUrl = (value: string | undefined) => {
    const postfixValue = getPostfixValueFilterNumber(
      initialParam || "",
      column
    );
    if (postfixValue) {
      selectedValues.delete(`${column}_${postfixValue}`);
    }
    // has value: set select
    if (value) {
      selectedValues.add(`${column}_${value}`);
    } else {
      setValue("");
      selectedValues.clear();
    }
    //no value: clear set
    if (selectedValues.size === 0) {
      updateSearchParam(undefined);
    } else {
      updateSearchParam(Array.from(selectedValues).join(","));
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
          {!!value && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              {options
                .filter((option) => value == option.value)
                .map((option) => (
                  <Badge
                    variant="secondary"
                    key={option.value}
                    className="rounded-sm px-1 font-normal"
                  >
                    {option.label}
                  </Badge>
                ))}
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
                const isSelected = value === option.value;
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        setValue("");
                      } else {
                        setValue(option.value);
                      }
                      handlePushUrl(isSelected ? undefined : option.value);
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
                    {/* Not show count */}
                    {/* <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                      1
                    </span> */}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {!!value && (
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
