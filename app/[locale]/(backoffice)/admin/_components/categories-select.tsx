"use client";

import { ErrorButton } from "@/components/buttons/error-button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { CategorySelect } from "@/types";
import { CategoryType } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import queryString from "query-string";
import Select from "react-select";

interface CategoriesSelectProps {
  defaultValue?: string;
  type: CategoryType;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  className?: string;
  error: string;
  notFound: string;
}
export const CategoriesSelect = ({
  defaultValue,
  type,
  onChange,
  placeholder,
  disabled,
  className,
  error,
  notFound,
}: CategoriesSelectProps) => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["categories_select", type],
    queryFn: async () => {
      const url = queryString.stringifyUrl(
        {
          url: "/api/categories/select",
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
      return (await res.json()) as CategorySelect[];
    },
  });

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
    <Select
      placeholder={placeholder}
      options={options}
      onChange={(newValue) => {
        if (newValue) {
          onChange(newValue.value);
        }
      }}
      value={option}
      isDisabled={disabled}
      className={cn("my-react-select-container", className)}
      classNamePrefix="my-react-select"
      noOptionsMessage={() => {
        return notFound;
      }}
    />
  );
};
