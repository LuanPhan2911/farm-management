"use client";

import { useQuery } from "@tanstack/react-query";
import { Organization } from "@clerk/nextjs/server";

import queryString from "query-string";
import { SelectItemContent } from "@/components/form/select-item";
import {
  ComboBoxCustom,
  ComboBoxCustomAppearance,
} from "@/components/form/combo-box";

interface OrgsSelectProps {
  defaultValue?: string;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
  placeholder: string;
  error: string;
  notFound: string;
  appearance?: ComboBoxCustomAppearance;
}
export const OrgsSelect = (props: OrgsSelectProps) => {
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

  return (
    <ComboBoxCustom
      {...props}
      data={data}
      isError={isError}
      isPending={isPending}
      refetch={refetch}
      labelKey="name"
      valueKey="id"
      renderItem={(item) => {
        return <SelectItemContent imageUrl={item.imageUrl} title={item.name} />;
      }}
    />
  );
};
