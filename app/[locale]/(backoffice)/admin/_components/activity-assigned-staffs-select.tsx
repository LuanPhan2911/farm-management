import {
  ComboBoxCustom,
  ComboBoxCustomAppearance,
} from "@/components/form/combo-box";
import { Staff } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import queryString from "query-string";
import { StaffSelectItem } from "./staffs-select";

interface ActivityAssignedStaffsSelectProps {
  activityId: string;
  onChange: (value: string | undefined) => void;
  defaultValue?: string;
  disabled?: boolean;
  placeholder: string;
  notFound: string;
  error: string;
  appearance?: ComboBoxCustomAppearance;
}

export const ActivityAssignedStaffsSelect = (
  props: ActivityAssignedStaffsSelectProps
) => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["activity_assigned_staffs_select", props.activityId],
    queryFn: async () => {
      const url = queryString.stringifyUrl(
        {
          url: "/api/activities/staffs/select",
          query: {
            activityId: props.activityId,
          },
        },
        {
          skipEmptyString: true,
        }
      );
      const res = await fetch(url);
      return (await res.json()) as Staff[];
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
      renderItem={(item) => <StaffSelectItem {...item} />}
    />
  );
};
