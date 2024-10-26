import { ErrorButton } from "@/components/buttons/error-button";
import {
  ComboBoxCustom,
  ComboBoxCustomAppearance,
} from "@/components/form/combo-box";
import { SelectItemContent } from "@/components/form/select-item";
import { Skeleton } from "@/components/ui/skeleton";
import { MaterialSelect } from "@/types";
import { useQuery } from "@tanstack/react-query";

interface MaterialsSelectProps {
  onChange: (value: string | undefined) => void;
  defaultValue?: string;
  disabled?: boolean;
  placeholder: string;
  notFound: string;
  error: string;
  appearance?: ComboBoxCustomAppearance;
}
export const MaterialsSelect = (props: MaterialsSelectProps) => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["materials"],
    queryFn: async () => {
      const res = await fetch("/api/materials/select");
      return (await res.json()) as MaterialSelect[];
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
          description={`Quantity in stock: ${item.quantityInStock} ${item.unit.name}`}
        />
      )}
    />
  );
};
