"use client";

import { useQuery } from "@tanstack/react-query";

import queryString from "query-string";
import {
  ComboBoxCustom,
  ComboBoxCustomAppearance,
} from "@/components/form/combo-box";
import { ActivitySelect } from "@/types";
import { useFormatter } from "next-intl";
import { ActivityStatusValue } from "../activities/_components/activity-status-value";
import { ActivityPriorityValue } from "../activities/_components/activity-priority-value";

interface ActivitiesSelectProps {
  defaultValue?: string;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
  placeholder: string;
  error: string;
  notFound: string;
  appearance?: ComboBoxCustomAppearance;
}
export const ActivitiesSelect = (props: ActivitiesSelectProps) => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["activities_select"],
    queryFn: async () => {
      const url = queryString.stringifyUrl(
        {
          url: "/api/activities/select",
        },
        {
          skipEmptyString: true,
        }
      );
      const res = await fetch(url);
      return (await res.json()) as ActivitySelect[];
    },
  });

  return (
    <ComboBoxCustom
      {...props}
      data={data}
      labelKey="name"
      valueKey="id"
      isError={isError}
      isPending={isPending}
      refetch={refetch}
      renderItem={(item) => {
        return <ActivitiesSelectItem {...item} />;
      }}
    />
  );
};
interface ActivitiesSelectItemProps extends ActivitySelect {}
const ActivitiesSelectItem = ({
  activityDate,
  name,
  priority,
  status,
}: ActivitiesSelectItemProps) => {
  const { relativeTime } = useFormatter();
  return (
    <div className="w-full flex flex-col gap-y-1">
      <div className="text-sm font-medium leading-none text-start">{name}</div>
      <div className=" flex items-center gap-x-1">
        <ActivityStatusValue value={status} />
        <ActivityPriorityValue value={priority} />
        <p className="text-xs text-muted-foreground">
          {relativeTime(activityDate)}
        </p>
      </div>
    </div>
  );
};
