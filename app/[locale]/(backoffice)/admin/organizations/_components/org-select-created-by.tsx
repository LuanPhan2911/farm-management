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
import { Staff } from "@prisma/client";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { StaffMetadataRole } from "../../_components/staff-metadata-role";

interface OrgSelectCreatedByProps {
  data: Staff[];
  onChange: (value: string) => void;
  value: string;
  disabled?: boolean;
  label: string;
  notFound: string;
}
export const OrgSelectCreatedBy = ({
  data,
  onChange,
  value,
  disabled,
  label,
  notFound,
}: OrgSelectCreatedByProps) => {
  const [open, setOpen] = useState(false);

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
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === staff.externalId ? "opacity-100" : "opacity-0"
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
