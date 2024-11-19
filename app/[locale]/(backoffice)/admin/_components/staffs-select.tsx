"use client";
import { cn } from "@/lib/utils";

import { useQuery } from "@tanstack/react-query";
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
import queryString from "query-string";
interface StaffSelectItemProps {
  imageUrl: string | undefined | null;
  name: string;
  email: string;
  role: StaffRole;
}
export const StaffSelectItem = ({
  email,
  imageUrl,
  name,
  role,
}: StaffSelectItemProps) => {
  return (
    <div className="flex items-center">
      <UserAvatar src={imageUrl || undefined} className="rounded-full" />
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
  orgId?: string | null;
  adminOnly?: boolean;
  farmerOnly?: boolean;
  superAdminOnly?: boolean;
  onChange: (value: string | undefined) => void;
  defaultValue?: string;
  disabled?: boolean;
  placeholder: string;
  notFound: string;
  error: string;
  appearance?: ComboBoxCustomAppearance;
}

export const StaffsSelect = (props: StaffsSelectProps) => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["staffs_select", props.adminOnly, props.farmerOnly, props.orgId],
    queryFn: async () => {
      const url = queryString.stringifyUrl(
        {
          url: "/api/staffs/select",
          query: {
            adminOnly: props.adminOnly,
            farmerOnly: props.farmerOnly,
            superAdminOnly: props.superAdminOnly,
            orgId: props.orgId,
          },
        },
        {
          skipEmptyString: true,
        }
      );
      const res = await fetch(url);
      return (await res.json()) as Staff[];
    },
  });

  return (
    <ComboBoxCustom
      {...props}
      data={data}
      isError={isError}
      isPending={isPending}
      refetch={refetch}
      valueKey="id"
      labelKey="name"
      renderItem={(item) => <StaffSelectItem {...item} />}
    />
  );
};
interface StaffsSelectMultipleProps {
  orgId?: string | null;
  adminOnly?: boolean;
  farmerOnly?: boolean;
  defaultValue?: string[];
  onChange: (value?: string[]) => void;
  disabled?: boolean;
  placeholder: string;
  notFound: string;
  error: string;
  className?: string;
  valueKey?: keyof Staff;
  labelKey?: keyof Staff;
  onSelected?: (values: Staff[]) => void;
}
export const StaffsSelectMultiple = ({
  adminOnly,
  farmerOnly,
  orgId,
  disabled,
  placeholder,
  notFound,
  error,
  onChange,
  defaultValue,
  labelKey,
  valueKey,
  className,
  onSelected,
}: StaffsSelectMultipleProps) => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["staffs_select", orgId, adminOnly, farmerOnly],
    queryFn: async () => {
      const url = queryString.stringifyUrl(
        {
          url: "/api/staffs/select",
          query: {
            orgId,
            adminOnly,
            farmerOnly,
          },
        },
        {
          skipEmptyString: true,
        }
      );
      const res = await fetch(url);
      return (await res.json()) as Staff[];
    },
  });

  const handleChange = (
    newValue: MultiValue<{
      label: string;
      value: string;
    }>
  ) => {
    onChange(newValue.map((item) => item.value));
  };
  if (isPending) {
    return <Skeleton className="lg:w-full h-10"></Skeleton>;
  }
  if (isError) {
    return <ErrorButton title={error} refresh={refetch} />;
  }
  const options = data.map((item) => {
    return {
      label: item[labelKey || "email"] as string,
      value: item[valueKey || "id"] as string,
    };
  });
  const defaultOptions = options.filter((item) => {
    return defaultValue?.includes(item.value);
  });

  return (
    <ReactSelect
      placeholder={placeholder}
      options={options}
      value={defaultOptions}
      onChange={handleChange}
      isDisabled={disabled}
      className={cn("my-react-select-container", className)}
      classNamePrefix="my-react-select"
      isMulti
      noOptionsMessage={() => notFound}
      closeMenuOnSelect={false}
    />
  );
};
