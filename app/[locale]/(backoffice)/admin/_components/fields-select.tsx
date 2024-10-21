import { ErrorButton } from "@/components/buttons/error-button";
import {
  ComboBoxCustom,
  ComboBoxCustomAppearance,
} from "@/components/form/combo-box";
import { SelectItemContentWithoutImage } from "@/components/form/select-item";
import { Skeleton } from "@/components/ui/skeleton";
import { FieldSelect } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

interface FieldsSelectProps {
  onChange: (value: string | undefined) => void;
  defaultValue?: string;
  disabled?: boolean;
  placeholder: string;
  notFound: string;
  error: string;
  appearance?: ComboBoxCustomAppearance;
}
export const FieldsSelect = ({
  defaultValue,
  error,
  placeholder,
  notFound,
  onChange,
  disabled,
  appearance,
}: FieldsSelectProps) => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["fields"],
    queryFn: async () => {
      const res = await fetch("/api/fields/select");
      return (await res.json()) as FieldSelect[];
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
        <SelectItemContentWithoutImage
          title={item.name}
          description={item.location}
        />
      )}
    />
  );
};
