import { ErrorButton } from "@/components/buttons/error-button";
import {
  ComboBoxCustom,
  ComboBoxCustomAppearance,
} from "@/components/form/combo-box";
import { InputDisabled } from "@/components/form/input-disabled";
import { SelectItemContentWithoutImage } from "@/components/form/select-item";
import { FormItem, FormLabel } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { PesticideSelect } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

interface PesticidesSelectProps {
  onChange: (value: string | undefined) => void;
  defaultValue?: string;
  disabled?: boolean;
  placeholder: string;
  notFound: string;
  errorLabel: string;
  appearance?: ComboBoxCustomAppearance;
}
export const PesticidesSelect = ({
  defaultValue,
  errorLabel,
  placeholder,
  notFound,
  onChange,
  disabled,
  appearance,
}: PesticidesSelectProps) => {
  const tSchema = useTranslations("pesticides.schema");
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["pesticides"],
    queryFn: async () => {
      const res = await fetch("/api/pesticides/select");
      return (await res.json()) as PesticideSelect[];
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
      noItemDetailMessage={tSchema("pesticideId.itemDetail")}
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
              <FormLabel>{tSchema("toxicityLevel.label")}</FormLabel>
              <InputDisabled
                placeholder={tSchema("toxicityLevel.placeholder")}
                value={
                  item.toxicityLevel
                    ? tSchema(`toxicityLevel.options.${item.toxicityLevel}`)
                    : undefined
                }
                defaultValue={tSchema("toxicityLevel.options.default")}
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
