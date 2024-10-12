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
import { useEffect, useState } from "react";
export interface ComboBoxData {
  label: string;
  value: string;
}
interface ComboBoxProps {
  options: ComboBoxData[];
  notFound: string;
  label: string;
  onChange: (value: string) => void;
  defaultValue?: string;
  className?: string;
}
export const ComboBoxDefault = ({
  options,
  notFound,
  label,
  onChange,
  defaultValue,
  className,
}: ComboBoxProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);
  const searchData = options.reduce(
    (a, b) => ({ ...a, [b.value]: b.label.toLowerCase() }),
    {} as Record<string, string | undefined>
  );
  const handleSelect = (currentValue: string) => {
    setValue(currentValue === value ? "" : currentValue);
    setOpen(false);
    onChange(currentValue === value ? "" : currentValue);
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("lg:w-[260px] w-full justify-between", className)}
        >
          <p className="truncate text-start">
            {value
              ? options.find((item) => item.value === value)?.label
              : label}
          </p>

          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("lg:w-[260px] w-full p-0", className)}>
        <Command
          filter={(value, search) => {
            return searchData[value]?.includes(search.toLowerCase()) ? 1 : 0;
          }}
        >
          <CommandInput placeholder={label} />
          <CommandList>
            <CommandEmpty>{notFound}</CommandEmpty>

            <CommandGroup>
              {options.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={handleSelect}
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
export type ComboBoxCustomAppearance = {
  button?: string;
  content?: string;
};
interface ComboBoxCustomProps<T extends Record<string, any>> {
  options: T[];
  labelKey: keyof T;
  valueKey: keyof T;
  notFound: string;
  label: string;
  disabled?: boolean;
  onChange: (value: string | undefined) => void;
  defaultValue?: string;
  renderItem: (item: T) => React.ReactNode;
  appearance?: ComboBoxCustomAppearance;
  renderItemDetail?: (item: T) => React.ReactNode;
  noItemDetailMessage?: string;
}
export const ComboBoxCustom = <T extends Record<string, any>>({
  options,
  labelKey,
  valueKey,
  label,
  notFound,
  disabled,
  appearance,
  defaultValue,
  noItemDetailMessage,
  onChange,
  renderItem,
  renderItemDetail,
}: ComboBoxCustomProps<T>) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);
  const handleSelect = (currentValue: string) => {
    setValue(currentValue === value ? undefined : currentValue);
    onChange(currentValue === value ? undefined : currentValue);

    setOpen(false);
  };
  const searchData = options.reduce(
    (a, b) => ({ ...a, [b[valueKey]]: b[labelKey].toLowerCase() }),
    {} as Record<string, string | undefined>
  );
  const selectedItem = options.find((item) => item[valueKey] === value);

  return (
    <div className="flex flex-col gap-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "lg:w-[260px] w-full justify-between",
              appearance?.button
            )}
            disabled={disabled}
          >
            {selectedItem ? renderItem(selectedItem) : label}

            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn("lg:w-[260px] p-0", appearance?.content)}>
          <Command
            filter={(value, search) => {
              return searchData[value]?.includes(search.toLowerCase()) ? 1 : 0;
            }}
          >
            <CommandInput placeholder={label} />
            <CommandList>
              <CommandEmpty>{notFound}</CommandEmpty>
              <CommandGroup>
                {options.map((item) => (
                  <CommandItem
                    key={item[valueKey]}
                    value={item[valueKey]}
                    onSelect={handleSelect}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === item[valueKey] ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {renderItem(item)}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {!selectedItem && renderItemDetail && (
        <div className="text-sm text-muted-foreground h-40 w-full flex justify-center items-center border  rounded-md">
          {noItemDetailMessage || "Please select item is popover"}
        </div>
      )}
      {selectedItem && renderItemDetail && renderItemDetail(selectedItem)}
    </div>
  );
};
