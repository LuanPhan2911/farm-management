import {
  ComboBoxCustom,
  ComboBoxCustomAppearance,
} from "@/components/form/combo-box";
import { SelectItemContentWithoutImage } from "@/components/form/select-item";
import { FieldSelect } from "@/types";
import { useQuery } from "@tanstack/react-query";

interface FieldsSelectProps {
  onChange: (value: string | undefined) => void;
  defaultValue?: string;
  disabled?: boolean;
  placeholder: string;
  notFound: string;
  error: string;
  appearance?: ComboBoxCustomAppearance;
}
export const FieldsSelect = (props: FieldsSelectProps) => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["fields"],
    queryFn: async () => {
      const res = await fetch("/api/fields/select");
      return (await res.json()) as FieldSelect[];
    },
  });

  return (
    <ComboBoxCustom
      {...props}
      valueKey="id"
      labelKey="name"
      data={data}
      isError={isError}
      isPending={isPending}
      refetch={refetch}
      renderItem={(item) => (
        <SelectItemContentWithoutImage
          title={item.name}
          description={item.location}
        />
      )}
    />
  );
};
