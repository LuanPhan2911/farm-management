"use client";

import { create } from "@/actions/unit";
import { ErrorButton } from "@/components/buttons/error-button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { UnitSelect } from "@/types";
import { Unit, UnitType } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import queryString from "query-string";
import { useTransition } from "react";
import Creatable from "react-select/creatable";
import { toast } from "sonner";

interface UnitsSelectProps {
  defaultValue?: string | null;
  unitType: UnitType;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  className?: string;
  error: string;
  notFound: string;
}
export const UnitsSelect = ({
  defaultValue,
  unitType: type,
  onChange,
  placeholder,
  disabled,
  className,
  error,
  notFound,
}: UnitsSelectProps) => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["units_select", type],
    queryFn: async () => {
      const url = queryString.stringifyUrl(
        {
          url: "/api/units/select",
          query: {
            type,
          },
        },
        {
          skipNull: true,
          skipEmptyString: true,
        }
      );
      const res = await fetch(url);
      return (await res.json()) as UnitSelect[];
    },
  });
  const handleCreate = async (inputValue: string) => {
    try {
      const { message, ok, data } = await create({ name: inputValue, type });
      if (ok) {
        toast.success(message);

        refetch();
      } else {
        toast.error(message);
      }
    } catch (error) {}
  };
  if (isPending) {
    return <Skeleton className="w-full h-12" />;
  }
  if (isError) {
    return <ErrorButton title={error} refresh={refetch} />;
  }

  const options = data.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
  const option = options.find((item) => item.value === defaultValue);

  return (
    <Creatable
      placeholder={placeholder}
      options={options}
      onChange={(newValue) => {
        if (newValue) {
          onChange(newValue.value);
        }
      }}
      onCreateOption={handleCreate}
      value={option}
      isDisabled={disabled}
      className={cn("my-react-select-container", className)}
      classNamePrefix="my-react-select"
      noOptionsMessage={() => notFound}
    />
  );
};
