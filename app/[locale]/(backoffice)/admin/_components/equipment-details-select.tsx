import {
  ComboBoxCustom,
  ComboBoxCustomAppearance,
} from "@/components/form/combo-box";
import { SelectItemContent } from "@/components/form/select-item";
import { EquipmentDetailSelectWithEquipment } from "@/types";
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
export const EquipmentDetailsSelect = (props: EquipmentDetailsSelectProps) => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["equipment-details-select"],
    queryFn: async () => {
      const res = await fetch("/api/equipment-details/select");
      return (await res.json()) as EquipmentDetailSelectWithEquipment[];
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
          imageUrl={item.equipment.imageUrl}
          title={item.name || item.equipment.name}
          description={`Location: ${item.location || "No filled"}`}
        />
      )}
    />
  );
};
