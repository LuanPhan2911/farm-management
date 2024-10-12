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

import { UserAvatar } from "@/components/user-avatar";
import { StaffMetadataRole } from "./staff-metadata-role";
import { StaffRole } from "@prisma/client";
import ReactSelect, { MultiValue } from "react-select";
import {
  ComboBoxCustom,
  ComboBoxCustomAppearance,
} from "@/components/form/combo-box";
interface StaffSelectItemProps {
  imageUrl: string | undefined | null;
  name: string;
  email: string;
  role: StaffRole;
}
const StaffSelectItem = ({
  email,
  imageUrl,
  name,
  role,
}: StaffSelectItemProps) => {
  return (
    <div className="flex items-center p-1">
      <UserAvatar
        src={imageUrl || undefined}
        size={"default"}
        className="rounded-full"
      />
      <div className="ml-4">
        <div className="text-sm font-medium leading-none text-start">
          {name}
          <span className="ml-2">
            <StaffMetadataRole
              metadata={{
                role,
              }}
            />
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{email}</p>
      </div>
    </div>
  );
};

interface StaffsSelectProps {
  queryKey: string[];
  queryFn: QueryFunction<Staff[]>;
  onChange: (value: string | undefined) => void;
  defaultValue: string;
  disabled?: boolean;
  label: string;
  notFound: string;
  errorLabel: string;
  appearance?: ComboBoxCustomAppearance;
}

export const StaffsSelect = ({
  queryKey,
  defaultValue,
  disabled,
  label,
  notFound,
  errorLabel,
  queryFn,
  onChange,
  appearance,
}: StaffsSelectProps) => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey,
    queryFn,
  });

  if (isPending) {
    return <Skeleton className="lg:w-[250px] w-full h-12"></Skeleton>;
  }
  if (isError) {
    return <ErrorButton title={errorLabel} refresh={refetch} />;
  }

  return (
    <ComboBoxCustom
      label={label}
      notFound={notFound}
      defaultValue={defaultValue}
      options={data}
      valueKey="id"
      labelKey="name"
      renderItem={(item) => <StaffSelectItem {...item} />}
      disabled={disabled}
      onChange={onChange}
      appearance={appearance}
    />
  );
};
interface StaffsSelectMultipleProps {
  onChange: (value: string) => void;
  disabled?: boolean;
  label: string;
  notFound: string;
  errorLabel: string;
  defaultValue?: string;
  className?: string;
}
export const StaffsSelectMultiple = ({
  disabled,
  label,
  notFound,
  errorLabel,
  onChange,
  className,
}: StaffsSelectMultipleProps) => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["staffs_select"],
    queryFn: async () => {
      const res = await fetch("/api/staffs/select");
      return (await res.json()) as Staff[];
    },
  });
  const handleChange = (
    newValue: MultiValue<{
      label: string;
      value: string;
    }>
  ) => {
    const result = JSON.stringify(newValue.map((item) => item.value));
    onChange(result);
  };
  if (isPending) {
    return <Skeleton className="lg:w-[250px] w-full h-12"></Skeleton>;
  }
  if (isError) {
    return <ErrorButton title={errorLabel} refresh={refetch} />;
  }
  const options = data.map((item) => {
    return {
      label: item.email,
      value: item.email,
    };
  });
  return (
    <ReactSelect
      placeholder={label}
      options={options}
      onChange={handleChange}
      isDisabled={disabled}
      className={cn("my-react-select-container", className)}
      classNamePrefix="my-react-select"
      isMulti
      noOptionsMessage={() => notFound}
    />
  );
};
