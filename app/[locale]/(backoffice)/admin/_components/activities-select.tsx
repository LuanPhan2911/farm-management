"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

import queryString from "query-string";
import { ErrorButton } from "@/components/buttons/error-button";
import { ComboBoxCustom } from "@/components/form/combo-box";
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
}
export const ActivitiesSelect = ({
  onChange,
  defaultValue,
  disabled,
  placeholder,
  error,
  notFound,
}: ActivitiesSelectProps) => {
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

  if (isPending) {
    return <Skeleton className="lg:w-[350px] w-full h-12"></Skeleton>;
  }
  if (isError) {
    return <ErrorButton title={error} refresh={refetch} />;
  }
  return (
    <ComboBoxCustom
      options={data}
      labelKey="name"
      valueKey="id"
      placeholder={placeholder}
      notFound={notFound}
      onChange={onChange}
      defaultValue={defaultValue}
      renderItem={(item) => {
        return <ActivitiesSelectItem {...item} />;
      }}
      appearance={{
        button: "lg:w-full h-15",
        content: "lg:w-[400px]",
      }}
      disabled={disabled}
    />
  );
};
interface ActivitiesSelectItemProps extends ActivitySelect {}
const ActivitiesSelectItem = ({
  activityDate,
  name,
  priority,
  status,
  note,
}: ActivitiesSelectItemProps) => {
  const { relativeTime } = useFormatter();
  return (
    <div className="w-full flex flex-col gap-y-2">
      <div className="text-sm font-medium leading-none text-start">{name}</div>
      <div className=" flex items-center gap-x-2">
        <ActivityStatusValue value={status} />
        <ActivityPriorityValue value={priority} />
        <p className="text-xs text-muted-foreground">
          {relativeTime(activityDate)}
        </p>
      </div>
    </div>
  );
};
