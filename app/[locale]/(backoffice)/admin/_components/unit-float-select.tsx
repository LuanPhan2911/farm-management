"use client";

import { create } from "@/actions/unit";
import { ErrorButton } from "@/components/buttons/error-button";
import { QueryProvider } from "@/components/providers/query-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { UnitSelect } from "@/types";
import { Unit } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import Creatable from "react-select/creatable";
import { toast } from "sonner";

interface UnitFloatSelectProps {
  defaultValue: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
}
const UnitFloatSelect = ({
  defaultValue,
  onChange,
  placeholder,
  disabled,
}: UnitFloatSelectProps) => {
  const [isCreating, startTransition] = useTransition();
  const t = useTranslations("units.status");
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["units_float_select"],
    queryFn: async () => {
      const res = await fetch("/api/units/select");
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
  console.log(option);

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
    />
  );
};
export const UnitFloatSelectWithQueryClient = (props: UnitFloatSelectProps) => {
  return (
    <QueryProvider>
      <UnitFloatSelect {...props} />
    </QueryProvider>
  );
};
