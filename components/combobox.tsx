"use client";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { cn } from "@/lib/utils";
import { useState } from "react";
export interface ComboBoxData {
  label: string;
  value: string;
}
interface ComboBoxProps {
  data: ComboBoxData[];
  labelSelect: string;
  labelSearch: string;
  labelNotfound: string;
  onChange: (value: string) => void;
}
export const ComboBox = ({
  data,
  labelSearch,
  labelSelect,
  labelNotfound,
  onChange,
}: ComboBoxProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
        >
          <p className="h-full w-[240px] truncate">
            {value
              ? data.find((item) => item.value === value)?.label
              : labelSelect}
          </p>

          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder={labelSearch} />
          <CommandList>
            <CommandEmpty>{labelNotfound}</CommandEmpty>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                    onChange(currentValue);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
