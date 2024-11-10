import {
  ComboBoxCustom,
  ComboBoxCustomAppearance,
} from "@/components/form/combo-box";
import { SelectItemContent } from "@/components/form/select-item";
import { EquipmentDetailSelectWithEquipmentAndUnit } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { EquipmentDetailStatusValue } from "../(inventory)/equipments/detail/[equipmentId]/_components/equipment-detail-status-value";
import queryString from "query-string";

interface EquipmentDetailsSelectProps {
  onChange: (value: string | undefined) => void;
  defaultValue?: string;
  disabled?: boolean;
  placeholder: string;
  notFound: string;
  error: string;
  appearance?: ComboBoxCustomAppearance;
  onSelected?: (value: EquipmentDetailSelectWithEquipmentAndUnit) => void;
}
export const EquipmentDetailsSelect = (props: EquipmentDetailsSelectProps) => {
  const { onSelected, defaultValue } = props;
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["equipment-details-select", defaultValue],
    queryFn: async () => {
      const url = queryString.stringifyUrl(
        {
          url: "/api/equipment-details/select",
          query: {
            id: defaultValue,
          },
        },
        {
          skipEmptyString: true,
          skipNull: true,
        }
      );
      const res = await fetch(url);
      return (await res.json()) as EquipmentDetailSelectWithEquipmentAndUnit[];
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
      isError={isError}
      isPending={isPending}
      refetch={refetch}
      valueKey="id"
      labelKey="name"
      renderItem={(item) => (
        <SelectItemContent
          imageUrl={item.equipment.imageUrl}
          title={item.name || item.equipment.name}
          description={<EquipmentDetailStatusValue status={item.status} />}
        />
      )}
    />
  );
};
