"use client";

import { useQuery } from "@tanstack/react-query";

import queryString from "query-string";
import {
  ComboBoxCustom,
  ComboBoxCustomAppearance,
} from "@/components/form/combo-box";

import { SelectItemContentWithoutImage } from "@/components/form/select-item";
import { useEffect } from "react";
import { ActivitySelectWithCrop } from "@/types";

interface ActivitiesSelectProps {
  defaultValue?: string;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
  placeholder: string;
  error: string;
  notFound: string;
  appearance?: ComboBoxCustomAppearance;
  onSelected?: (value: ActivitySelectWithCrop) => void;
}
export const ActivitiesSelect = (props: ActivitiesSelectProps) => {
  const { onSelected, defaultValue } = props;
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["activities_select", defaultValue],
    queryFn: async () => {
      const url = queryString.stringifyUrl(
        {
          url: "/api/activities/select",
          query: {
            id: defaultValue,
          },
        },

        {
          skipEmptyString: true,
        }
      );
      const res = await fetch(url);
      return (await res.json()) as ActivitySelectWithCrop[];
    },
  });

  useEffect(() => {
    const selected = data?.find((item) => item.id === defaultValue);

    if (!selected) {
      return;
    }
    onSelected?.(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, defaultValue]);

  return (
    <ComboBoxCustom
      {...props}
      data={data}
      labelKey="name"
      valueKey="id"
      isError={isError}
      isPending={isPending}
      refetch={refetch}
      renderItem={(item) => {
        return (
          <SelectItemContentWithoutImage
            title={item.name}
            description={item.crop.name}
          />
        );
      }}
    />
  );
};
