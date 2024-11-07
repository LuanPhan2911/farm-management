import {
  ComboBoxCustom,
  ComboBoxCustomAppearance,
} from "@/components/form/combo-box";
import { SelectItemContent } from "@/components/form/select-item";
import { MaterialSelect } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

interface MaterialsSelectProps {
  onChange: (value: string | undefined) => void;
  defaultValue?: string;
  disabled?: boolean;
  placeholder: string;
  notFound: string;
  error: string;
  appearance?: ComboBoxCustomAppearance;
  onSelected?: (value: MaterialSelect) => void;
}
export const MaterialsSelect = (props: MaterialsSelectProps) => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["materials"],
    queryFn: async () => {
      const res = await fetch("/api/materials/select");
      return (await res.json()) as MaterialSelect[];
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
      isError={isError}
      isPending={isPending}
      refetch={refetch}
      valueKey="id"
      labelKey="name"
      renderItem={(item) => (
        <SelectItemContent
          imageUrl={item.imageUrl}
          title={item.name}
          description={`Remain: ${item.quantityInStock} ${item.unit.name}`}
        />
      )}
    />
  );
};
