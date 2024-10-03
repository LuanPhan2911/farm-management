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
  errorLabel: string;
  notFound: string;
}
export const UnitsSelect = ({
  defaultValue,
  unitType: type,
  onChange,
  placeholder,
  disabled,
  className,
  errorLabel,
  notFound,
}: UnitsSelectProps) => {
  const [isCreating, startTransition] = useTransition();
  const t = useTranslations("units.status");
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
  const handleCreate = (inputValue: string) => {
    startTransition(() => {
      create({
        name: inputValue,
        type,
      })
        .then(({ message, ok, data }) => {
          if (ok) {
            toast.success(message);
            const unit = data as Unit;
            refetch();
            onChange(unit.id);
          } else {
            toast.error(message);
          }
        })
        .catch(() => {
          toast.error(t("failure.create"));
        });
    });
  };
  if (isPending) {
    return <Skeleton className="w-full h-12" />;
  }
  if (isError) {
    return <ErrorButton title={errorLabel} refresh={refetch} />;
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
      isDisabled={disabled || isCreating}
      className={cn("my-react-select-container", className)}
      classNamePrefix="my-react-select"
    />
  );
};
