import { ErrorButton } from "@/components/buttons/error-button";
import {
  ComboBoxCustom,
  ComboBoxCustomAppearance,
} from "@/components/form/combo-box";
import { InputDisabled } from "@/components/form/input-disabled";
import { SelectItemContentWithoutImage } from "@/components/form/select-item";
import { FormItem, FormLabel } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { FertilizerSelect } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

interface FertilizersSelectProps {
  onChange: (value: string | undefined) => void;
  defaultValue?: string;
  disabled?: boolean;
  placeholder: string;
  notFound: string;
  errorLabel: string;
  appearance?: ComboBoxCustomAppearance;
}
export const FertilizersSelect = ({
  defaultValue,
  errorLabel,
  placeholder,
  notFound,
  onChange,
  disabled,
  appearance,
}: FertilizersSelectProps) => {
  const tSchema = useTranslations("fertilizers.schema");
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["fertilizers"],
    queryFn: async () => {
      const res = await fetch("/api/fertilizers/select");
      return (await res.json()) as FertilizerSelect[];
    },
  });
  if (isPending) {
    return <Skeleton className="lg:w-[250px] w-full h-12"></Skeleton>;
  }
  if (isError) {
    return <ErrorButton title={errorLabel} refresh={refetch} />;
  }

  return (
    <ComboBoxCustom
      label={placeholder}
      notFound={notFound}
      onChange={onChange}
      defaultValue={defaultValue}
      disabled={disabled}
      options={data}
      appearance={appearance}
      valueKey="id"
      labelKey="name"
      renderItem={(item) => (
        <SelectItemContentWithoutImage
          title={item.name}
          description={tSchema(`type.options.${item.type}`)}
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
            <FormItem>
              <FormLabel>{tSchema("frequencyOfUse.label")}</FormLabel>
              <InputDisabled
                placeholder={tSchema("frequencyOfUse.placeholder")}
                value={
                  item.frequencyOfUse
                    ? tSchema(`frequencyOfUse.options.${item.frequencyOfUse}`)
                    : undefined
                }
                defaultValue={tSchema("frequencyOfUse.options.default")}
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
