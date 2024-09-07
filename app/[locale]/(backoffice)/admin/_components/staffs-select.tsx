"use client";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

import { QueryFunction, useQuery } from "@tanstack/react-query";
import { Staff } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";

import { ErrorButton } from "@/components/buttons/error-button";
import { StaffSelectItem } from "./staff-select-item";
import { QueryProvider } from "@/components/providers/query-provider";

interface StaffsSelectProps {
  queryKey: string[];
  queryFn: QueryFunction<Staff[]>;
  onChange: (value: string) => void;
  defaultValue: string;
  disabled?: boolean;
  label: string;
  notFound: string;
  errorLabel: string;
}

function StaffsSelect({
  queryKey,
  defaultValue,
  disabled,
  label,
  notFound,
  errorLabel,
  queryFn,
  onChange,
}: StaffsSelectProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue || "");
  const { data, isPending, isError, refetch } = useQuery({
    queryKey,
    queryFn,
  });
  const onSelect = (currentValue: string) => {
    setValue(currentValue === value ? "" : currentValue);
    const currentStaff = data?.find((item) => item.email === currentValue);
    if (currentStaff) {
      onChange(currentValue === value ? "" : currentStaff.externalId);
    }
    setOpen(false);
  };
  if (isPending) {
    return <Skeleton className="w-full h-12"></Skeleton>;
  }
  if (isError) {
    return <ErrorButton title={errorLabel} refresh={refetch} />;
  }
  const currentStaff = data.find((item) => item.email === value);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between px-2"
          disabled={disabled}
          size={"lg"}
        >
          {currentStaff ? (
            <StaffSelectItem
              email={currentStaff.email}
              imageUrl={currentStaff.imageUrl || undefined}
              name={currentStaff.name}
              role={currentStaff.role}
            />
          ) : (
            label
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[450px] p-0">
        <Command>
          <CommandInput placeholder={label} />
          <CommandList>
            <CommandEmpty>{notFound}</CommandEmpty>
            <CommandGroup>
              {data.map((staff) => (
                <CommandItem
                  key={staff.externalId}
                  value={staff.email}
                  onSelect={onSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === staff.email ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <StaffSelectItem
                    email={staff.email}
                    imageUrl={staff.imageUrl || undefined}
                    name={staff.name}
                    role={staff.role}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export const StaffSelectWithQueryClient = (props: StaffsSelectProps) => {
  return (
    <QueryProvider>
      <StaffsSelect {...props} />
    </QueryProvider>
  );
};
