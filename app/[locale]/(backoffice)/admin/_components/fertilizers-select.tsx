import {
  ComboBoxCustom,
  ComboBoxCustomAppearance,
} from "@/components/form/combo-box";
import { InputDisabled } from "@/components/form/input-disabled";
import { SelectItemContentWithoutImage } from "@/components/form/select-item";
import { FormItem, FormLabel } from "@/components/ui/form";
import { FertilizerSelect } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

interface FertilizersSelectProps {
  onChange: (value: string | undefined) => void;
  defaultValue?: string;
  disabled?: boolean;
  placeholder: string;
  notFound: string;
  error: string;
  appearance?: ComboBoxCustomAppearance;
  valueKey?: keyof FertilizerSelect;
  labelKey?: keyof FertilizerSelect;
  onSelected?: (value: FertilizerSelect) => void;
}
export const FertilizersSelect = (props: FertilizersSelectProps) => {
  const tSchema = useTranslations("fertilizers.schema");
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["fertilizers"],
    queryFn: async () => {
      const res = await fetch("/api/fertilizers/select");
      return (await res.json()) as FertilizerSelect[];
    },
  });
  const { onSelected, defaultValue } = props;
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
      isError={isError}
      isPending={isPending}
      refetch={refetch}
      data={data}
      valueKey={props.valueKey || "id"}
      labelKey={props.labelKey || "name"}
      renderItem={(item) => (
        <SelectItemContentWithoutImage
          title={item.name}
          description={tSchema(`type.options.${item.type || "default"}`)}
        />
      )}
      noItemDetailMessage={tSchema("fertilizerId.itemDetail")}
      renderItemDetail={(item) => {
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-5 gap-2">
              <div className="col-span-3">
                <FormItem>
                  <FormLabel>{tSchema("recommendedDosage.label")}</FormLabel>
                  <InputDisabled
                    placeholder={tSchema("recommendedDosage.placeholder")}
                    value={item.recommendedDosage?.value}
                    defaultValue={tSchema("recommendedDosage.value.default")}
                  />
                </FormItem>
              </div>
              <div className="col-span-2">
                <FormItem>
                  <FormLabel>
                    {tSchema("recommendedDosage.unitId.label")}
                  </FormLabel>
                  <InputDisabled
                    placeholder={tSchema(
                      "recommendedDosage.unitId.placeholder"
                    )}
                    value={item.recommendedDosage?.unit?.name}
                    defaultValue={tSchema("recommendedDosage.unitId.default")}
                  />
                </FormItem>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <FormItem>
                <FormLabel>{tSchema("type.label")}</FormLabel>
                <InputDisabled
                  placeholder={tSchema("type.placeholder")}
                  value={tSchema(`type.options.${item.type || "default"}`)}
                />
              </FormItem>
              <FormItem>
                <FormLabel>{tSchema("nutrientOfNPK.label")}</FormLabel>
                <InputDisabled
                  placeholder={tSchema("nutrientOfNPK.placeholder")}
                  value={item.nutrientOfNPK}
                  defaultValue={tSchema("nutrientOfNPK.default")}
                />
              </FormItem>
            </div>
            <FormItem>
              <FormLabel>{tSchema("frequencyOfUse.label")}</FormLabel>
              <InputDisabled
                placeholder={tSchema("frequencyOfUse.placeholder")}
                value={tSchema(
                  `frequencyOfUse.options.${item.frequencyOfUse || "default"}`
                )}
              />
            </FormItem>
            <FormItem>
              <FormLabel>{tSchema("applicationMethod.label")}</FormLabel>
              <InputDisabled
                placeholder={tSchema("applicationMethod.placeholder")}
                value={item.applicationMethod}
                defaultValue={tSchema("applicationMethod.default")}
              />
            </FormItem>
          </div>
        );
      }}
    />
  );
};
