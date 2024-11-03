"use client";

import {
  ComboBoxCustom,
  ComboBoxCustomAppearance,
} from "@/components/form/combo-box";
import { SelectItemContentWithoutImage } from "@/components/form/select-item";
import { CategorySelect } from "@/types";
import { CategoryType } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import queryString from "query-string";

interface CategoriesSelectProps {
  defaultValue?: string;
  type: CategoryType;
  onChange: (value: string | undefined) => void;
  placeholder: string;
  disabled?: boolean;
  error: string;
  notFound: string;
  appearance?: ComboBoxCustomAppearance;
  labelKey?: keyof CategorySelect;
  valueKey?: keyof CategorySelect;
}
export const CategoriesSelect = (props: CategoriesSelectProps) => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["categories_select", props.type],
    queryFn: async () => {
      const url = queryString.stringifyUrl(
        {
          url: "/api/categories/select",
          query: {
            type: props.type,
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

  return (
    <ComboBoxCustom
      {...props}
      isError={isError}
      isPending={isPending}
      refetch={refetch}
      data={data}
      valueKey={props.valueKey || "id"}
      labelKey={props.labelKey || "name"}
      renderItem={(item) => (
        <SelectItemContentWithoutImage
          title={item.name}
          description={item.description}
        />
      )}
    />
  );
};
