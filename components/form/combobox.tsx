"use client";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
  isSearch?: boolean;
}
export const ComboBox = ({
  data,
  notFound,
  label,
  onChange,
  isSearch = true,
}: ComboBoxProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

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
        <Command shouldFilter={isSearch}>
          {isSearch && <CommandInput placeholder={label} />}
          <CommandList>
            {isSearch && <CommandEmpty>{notFound}</CommandEmpty>}

            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                    onChange(currentValue === value ? "" : currentValue);
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
