import {
  ComboBoxCustom,
  ComboBoxCustomAppearance,
} from "@/components/form/combo-box";
import { SelectItemContentWithoutImage } from "@/components/form/select-item";
import { FieldSelect } from "@/types";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import queryString from "query-string";

interface FieldsSelectProps {
  onChange: (value: string | undefined) => void;
  defaultValue?: string;
  disabled?: boolean;
  placeholder: string;
  notFound: string;
  error: string;
  appearance?: ComboBoxCustomAppearance;
  isCreateCrop?: boolean;
}
export const FieldsSelect = (props: FieldsSelectProps) => {
  const { orgId } = useAuth();
  const { isCreateCrop } = props;
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["fields_select", isCreateCrop, orgId],
    queryFn: async () => {
      const url = queryString.stringifyUrl(
        {
          url: "/api/fields/select",
          query: {
            orgId,
            isCreateCrop,
          },
        },
        {
          skipEmptyString: true,
          skipNull: true,
        }
      );
      const res = await fetch(url);
      return (await res.json()) as FieldSelect[];
    },
  });

  return (
    <ComboBoxCustom
      {...props}
      valueKey="id"
      labelKey="name"
      data={data}
      isError={isError}
      isPending={isPending}
      refetch={refetch}
      renderItem={(item) => (
        <SelectItemContentWithoutImage
          title={item.name}
          description={item.location}
        />
      )}
    />
  );
};
