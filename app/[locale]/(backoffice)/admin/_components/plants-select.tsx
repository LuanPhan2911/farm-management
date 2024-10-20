import { ErrorButton } from "@/components/buttons/error-button";
import {
  ComboBoxCustom,
  ComboBoxCustomAppearance,
} from "@/components/form/combo-box";
import { SelectItemContent } from "@/components/form/select-item";
import { Skeleton } from "@/components/ui/skeleton";
import { PlantSelect } from "@/types";
import { useQuery } from "@tanstack/react-query";

interface PlantsSelectProps {
  onChange: (value: string | undefined) => void;
  defaultValue?: string;
  disabled?: boolean;
  placeholder: string;
  notFound: string;
  errorLabel: string;
  appearance?: ComboBoxCustomAppearance;
}
export const PlantsSelect = ({
  defaultValue,
  errorLabel,
  placeholder,
  notFound,
  onChange,
  disabled,
  appearance,
}: PlantsSelectProps) => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["plants"],
    queryFn: async () => {
      const res = await fetch("/api/plants/select");
      return (await res.json()) as PlantSelect[];
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
        <SelectItemContent imageUrl={item.imageUrl} title={item.name} />
      )}
    />
  );
};
