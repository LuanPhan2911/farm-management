import { ErrorButton } from "@/components/buttons/error-button";
import {
  ComboBoxCustom,
  ComboBoxCustomAppearance,
} from "@/components/form/combo-box";
import { SelectItemContent } from "@/components/form/select-item";
import { Skeleton } from "@/components/ui/skeleton";
import { EquipmentDetailSelect } from "@/types";
import { useQuery } from "@tanstack/react-query";

interface EquipmentDetailsSelectProps {
  onChange: (value: string | undefined) => void;
  defaultValue?: string;
  disabled?: boolean;
  placeholder: string;
  notFound: string;
  error: string;
  appearance?: ComboBoxCustomAppearance;
}
export const EquipmentDetailsSelect = ({
  defaultValue,
  error,
  placeholder,
  notFound,
  onChange,
  disabled,
  appearance,
}: EquipmentDetailsSelectProps) => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["equipment-details-select"],
    queryFn: async () => {
      const res = await fetch("/api/equipment-details/select");
      return (await res.json()) as EquipmentDetailSelect[];
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
          imageUrl={item.equipment.imageUrl}
          title={item.name || item.equipment.name}
        />
      )}
    />
  );
};
