import {
  ComboBoxCustom,
  ComboBoxCustomAppearance,
} from "@/components/form/combo-box";
import { InputDisabled } from "@/components/form/input-disabled";
import { SelectItemContentWithoutImage } from "@/components/form/select-item";
import { FormItem, FormLabel } from "@/components/ui/form";
import { PesticideSelect } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

interface PesticidesSelectProps {
  onChange: (value: string | undefined) => void;
  defaultValue?: string;
  disabled?: boolean;
  placeholder: string;
  notFound: string;
  error: string;
  appearance?: ComboBoxCustomAppearance;
  valueKey?: keyof PesticideSelect;
  labelKey?: keyof PesticideSelect;
}
export const PesticidesSelect = (props: PesticidesSelectProps) => {
  const tSchema = useTranslations("pesticides.schema");
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["pesticides"],
    queryFn: async () => {
      const res = await fetch("/api/pesticides/select");
      return (await res.json()) as PesticideSelect[];
    },
  });

  return (
    <ComboBoxCustom
      {...props}
      data={data}
      isError={isError}
      isPending={isPending}
      refetch={refetch}
      valueKey={props.valueKey || "id"}
      labelKey={props.labelKey || "name"}
      renderItem={(item) => (
        <SelectItemContentWithoutImage
          title={item.name}
          description={tSchema(`type.options.${item.type || "default"}`)}
        />
      )}
      noItemDetailMessage={tSchema("pesticideId.itemDetail")}
      renderItemDetail={(item) => {
        return (
          <div className="space-y-2">
            <FormItem>
              <FormLabel>{tSchema("type.label")}</FormLabel>
              <InputDisabled
                placeholder={tSchema("type.placeholder")}
                value={tSchema(`type.options.${item.type || "default"}`)}
              />
            </FormItem>
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
            <div className="grid grid-cols-5 gap-2">
              <div className="col-span-3">
                <FormItem>
                  <FormLabel>{tSchema("withdrawalPeriod.label")}</FormLabel>
                  <InputDisabled
                    placeholder={tSchema("withdrawalPeriod.placeholder")}
                    value={item.withdrawalPeriod?.value}
                    defaultValue={tSchema("withdrawalPeriod.value.default")}
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
            <FormItem>
              <FormLabel>{tSchema("toxicityLevel.label")}</FormLabel>
              <InputDisabled
                placeholder={tSchema("toxicityLevel.placeholder")}
                value={tSchema(
                  `toxicityLevel.options.${item.toxicityLevel || "default"}`
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
