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
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";
import { ErrorButton } from "../buttons/error-button";
export interface ComboBoxData {
  label: string;
  value: string;
}
interface ComboBoxProps {
  options: ComboBoxData[];
  notFound: string;
  placeholder: string;
  onChange: (value: string) => void;
  defaultValue?: string;
  appearance?: ComboBoxCustomAppearance;
  disabled?: boolean;
}
export const ComboBoxDefault = ({
  options,
  notFound,
  placeholder,
  onChange,
  defaultValue,
  disabled,
  appearance,
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
          className={cn(
            "lg:w-[260px] w-full justify-between",
            appearance?.button
          )}
          disabled={disabled}
        >
          <p className="truncate text-start">
            {value
              ? options.find((item) => item.value === value)?.label
              : placeholder}
          </p>

          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("lg:w-[260px] w-full p-0", appearance?.content)}
      >
        <Command
          filter={(value, search) => {
            return searchData[value]?.includes(search.toLowerCase()) ? 1 : 0;
          }}
        >
          <CommandInput placeholder={placeholder} />
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
  data: T[] | undefined;
  isPending: boolean;
  isError: boolean;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<T[], Error>>;
  labelKey: keyof T;
  valueKey: keyof T;
  notFound: string;
  error: string;
  placeholder: string;
  disabled?: boolean;
  onChange: (value: string | undefined) => void;
  defaultValue?: string;
  renderItem: (item: T) => React.ReactNode;
  appearance?: ComboBoxCustomAppearance;
  renderItemDetail?: (item: T) => React.ReactNode;
  noItemDetailMessage?: string;
}
export const ComboBoxCustom = <T extends Record<string, any>>({
  data: options,
  labelKey,
  valueKey,
  placeholder,
  notFound,
  error,
  disabled,
  appearance,
  defaultValue,
  noItemDetailMessage,
  isPending,
  isError,
  refetch,
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

  const searchData = options?.reduce(
    (a, b) => ({ ...a, [b[valueKey]]: b[labelKey].toLowerCase() }),
    {} as Record<string, string | undefined>
  );
  const selectedItem = options?.find((item) => item[valueKey] === value);

  if (isPending) {
    return (
      <Skeleton className={cn("lg:w-full h-12", appearance?.button)}></Skeleton>
    );
  }
  if (isError) {
    return <ErrorButton title={error} refresh={refetch} />;
  }
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
            {selectedItem ? renderItem(selectedItem) : placeholder}

            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn("lg:w-[260px] p-0", appearance?.content)}>
          <Command
            filter={(value, search) => {
              return searchData?.[value]?.includes(search.toLowerCase())
                ? 1
                : 0;
            }}
          >
            <CommandInput placeholder={placeholder} />
            <CommandList>
              <CommandEmpty>{notFound}</CommandEmpty>
              <CommandGroup>
                {options?.map((item) => (
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
