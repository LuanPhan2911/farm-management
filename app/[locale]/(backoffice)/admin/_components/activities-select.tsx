"use client";

import { useQuery } from "@tanstack/react-query";

import queryString from "query-string";
import {
  ComboBoxCustom,
  ComboBoxCustomAppearance,
} from "@/components/form/combo-box";
import { ActivitySelectWithCropAndField } from "@/types";
import { SelectItemContentWithoutImage } from "@/components/form/select-item";
import { useEffect } from "react";

interface ActivitiesSelectProps {
  defaultValue?: string;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
  placeholder: string;
  error: string;
  notFound: string;
  appearance?: ComboBoxCustomAppearance;
  onSelected?: (value: ActivitySelectWithCropAndField) => void;
}
export const ActivitiesSelect = (props: ActivitiesSelectProps) => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["activities_select"],
    queryFn: async () => {
      const url = queryString.stringifyUrl(
        {
          url: "/api/activities/select",
        },
        {
          skipEmptyString: true,
        }
      );
      const res = await fetch(url);
      return (await res.json()) as ActivitySelectWithCropAndField[];
    },
  });
  useEffect(() => {
    const selected = data?.find((item) => item.id === props.defaultValue);
    if (!selected) {
      return;
    }
    props.onSelected?.(selected);
  }, [data, props]);

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
