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
  notFound: string;
  label: string;
  onChange: (value: string) => void;
  defaultValue?: string;
}
export const ComboBox = ({
  data,
  notFound,
  label,
  defaultValue,
  onChange,
}: ComboBoxProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue || "");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="success"
          role="combobox"
          aria-expanded={open}
          className="w-[260px] justify-between"
        >
          <p className="h-full w-[240px] truncate">
            {value ? data.find((item) => item.value === value)?.label : label}
          </p>

          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[260px] p-0">
        <Command>
          <CommandInput placeholder={label} />
          <CommandList>
            <CommandEmpty>{notFound}</CommandEmpty>
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
