"use client";

import { create } from "@/actions/unit";
import { ErrorButton } from "@/components/buttons/error-button";
import { QueryProvider } from "@/components/providers/query-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { UnitSelect } from "@/types";
import { Unit, UnitType } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import queryString from "query-string";
import { useTransition } from "react";
import Creatable from "react-select/creatable";
import { toast } from "sonner";

interface UnitsSelectProps {
  defaultValue?: string;
  unitType: UnitType;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  className?: string;
}
const UnitsSelect = ({
  defaultValue,
  unitType: type,
  onChange,
  placeholder,
  disabled,
  className,
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
    return (
      <ErrorButton
        title="Something went wrong when load units"
        refresh={refetch}
      />
    );
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
      className={className}
    />
  );
};
export const UnitsSelectWithQueryClient = (props: UnitsSelectProps) => {
  return (
    <QueryProvider>
      <UnitsSelect {...props} />
    </QueryProvider>
  );
};
