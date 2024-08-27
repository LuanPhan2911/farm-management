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
import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { StaffMetadataRole } from "../../_components/staff-metadata-role";
import { useQuery } from "@tanstack/react-query";
import { Staff } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";

interface OrgSelectCreatedByProps {
  onChange: (value: string) => void;
  defaultValue: string;
  disabled?: boolean;
  label: string;
  notFound: string;
}

export const OrgSelectCreatedBy = ({
  onChange,
  defaultValue,
  disabled,
  label,
  notFound,
}: OrgSelectCreatedByProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue || "");
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["created_by_org"],
    queryFn: async () => {
      const res = await fetch("/api/staffs/created_by_org");
      return (await res.json()) as Staff[];
    },
  });
  const onSelect = (currentValue: string) => {
    setValue(currentValue === value ? "" : currentValue);
    const currentStaff = data?.find((staff) => staff.email === currentValue);
    if (currentStaff) {
      onChange(currentValue === value ? "" : currentStaff.externalId);
    }
    setOpen(false);
  };
  if (isPending) {
    return <Skeleton className="w-full h-12"></Skeleton>;
  }
  if (isError) {
    return (
      <div
        className="w-full h-12 text-sm text-destructive border 
      rounded-md px-2 flex items-center justify-center gap-x-2"
      >
        Something went wrong went load created by!{" "}
        <Button
          variant={"success"}
          size={"sm"}
          type="button"
          onClick={() => refetch()}
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>
    );
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {value ? data.find((staff) => staff.email === value)?.email : label}

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[450px] p-0">
        <Command>
          <CommandInput placeholder="Search staff..." />
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
                  <div className="flex items-center">
                    <UserAvatar
                      src={staff.imageUrl || undefined}
                      size={"default"}
                      className="rounded-full"
                    />
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {staff.name}
                        <span className="ml-2">
                          <StaffMetadataRole
                            metadata={{
                              role: staff.role,
                            }}
                          />
                        </span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {staff.email}
                      </p>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
