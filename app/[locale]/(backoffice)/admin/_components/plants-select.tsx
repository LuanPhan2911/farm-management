import {
  ComboBoxCustom,
  ComboBoxCustomAppearance,
} from "@/components/form/combo-box";
import { SelectItemContent } from "@/components/form/select-item";
import { PlantSelect } from "@/types";
import { useQuery } from "@tanstack/react-query";

interface PlantsSelectProps {
  onChange: (value: string | undefined) => void;
  defaultValue?: string;
  disabled?: boolean;
  placeholder: string;
  notFound: string;
  error: string;
  appearance?: ComboBoxCustomAppearance;
}
export const PlantsSelect = (props: PlantsSelectProps) => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["plants"],
    queryFn: async () => {
      const res = await fetch("/api/plants/select");
      return (await res.json()) as PlantSelect[];
    },
  });

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
          description={item.category.name}
        />
      )}
    />
  );
};
