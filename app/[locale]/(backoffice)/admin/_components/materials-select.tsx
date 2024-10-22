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
export const MaterialsSelect = ({
  defaultValue,
  error,
  placeholder,
  notFound,
  onChange,
  disabled,
  appearance,
}: MaterialsSelectProps) => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["materials"],
    queryFn: async () => {
      const res = await fetch("/api/materials/select");
      return (await res.json()) as MaterialSelect[];
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
      placeholder={placeholder}
      notFound={notFound}
      onChange={onChange}
      defaultValue={defaultValue}
      disabled={disabled}
      options={data}
      appearance={appearance}
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
