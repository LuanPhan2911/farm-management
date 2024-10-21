"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Organization } from "@clerk/nextjs/server";

import queryString from "query-string";
import { ErrorButton } from "@/components/buttons/error-button";
import { SelectItemContent } from "@/components/form/select-item";
import { ComboBoxCustom } from "@/components/form/combo-box";

interface OrgsSelectProps {
  defaultValue?: string;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
  placeholder: string;
  error: string;
  notFound: string;
}
export const OrgsSelect = ({
  onChange,
  defaultValue,
  disabled,
  placeholder,
  error,
  notFound,
}: OrgsSelectProps) => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["orgs_select"],
    queryFn: async () => {
      const url = queryString.stringifyUrl(
        {
          url: "/api/organizations/select",
        },
        {
          skipEmptyString: true,
        }
      );
      const res = await fetch(url);
      return (await res.json()) as Organization[];
    },
  });

  if (isPending) {
    return <Skeleton className="lg:w-[250px] w-full h-12"></Skeleton>;
  }
  if (isError) {
    return <ErrorButton title={error} refresh={refetch} />;
  }
  return (
    <ComboBoxCustom
      options={data}
      labelKey="name"
      valueKey="id"
      placeholder={placeholder}
      notFound={notFound}
      onChange={onChange}
      defaultValue={defaultValue}
      renderItem={(item) => {
        return <SelectItemContent imageUrl={item.imageUrl} title={item.name} />;
      }}
      appearance={{
        button: "lg:w-full",
        content: "lg:w-[480px]",
      }}
      disabled={disabled}
    />
  );
};
