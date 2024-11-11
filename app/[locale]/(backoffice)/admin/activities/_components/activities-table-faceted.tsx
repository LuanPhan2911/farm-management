"use client";

import { useTranslations } from "next-intl";
import { ErrorButton } from "@/components/buttons/error-button";
import { FacetedFilterStringButton } from "@/components/buttons/faceted-filter-string-button";
import { Skeleton } from "@/components/ui/skeleton";
import { ActivityPriorityCount, ActivityStatusCount } from "@/types";
import { ActivityPriority, ActivityStatus } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

import { useParams, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { DatePickerWithRangeButton } from "@/components/buttons/date-picker-range-button";
import { SelectData, SelectOptions } from "@/components/form/select-options";
import { useUpdateSearchParam } from "@/hooks/use-update-search-param";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";

const ActivitiesFacetedStatus = () => {
  const searchParams = useSearchParams();
  const begin = searchParams!.get("begin");
  const end = searchParams!.get("end");
  const t = useTranslations("activities");
  const params = useParams<{
    cropId: string;
  }>()!;
  const options = Object.values(ActivityStatus).map((item) => ({
    label: t(`schema.status.options.${item}`),
    value: item,
  }));
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["activities_count_status", begin, end, params.cropId],
    queryFn: async () => {
      const url = queryString.stringifyUrl(
        {
          url: `/api/activities/count_status`,
          query: {
            begin,
            end,
            cropId: params.cropId,
          },
        },
        {
          skipEmptyString: true,
          skipNull: true,
        }
      );
      const res = await fetch(url);
      return (await res.json()) as ActivityStatusCount[];
    },
  });

  if (isPending) {
    return <Skeleton className="w-32 h-8"></Skeleton>;
  }
  if (isError) {
    return (
      <ErrorButton title={t("search.faceted.status.error")} refresh={refetch} />
    );
  }
  const counts = data.reduce(
    (obj, item) => ({ ...obj, [item.status]: item._count }),
    {}
  );
  return (
    <FacetedFilterStringButton
      options={options}
      column="status"
      title={t("search.faceted.status.placeholder")}
      counts={counts}
    />
  );
};
const ActivitiesFacetedPriority = () => {
  const searchParams = useSearchParams();
  const begin = searchParams!.get("begin");
  const end = searchParams!.get("end");
  const params = useParams<{
    cropId: string;
  }>()!;
  const t = useTranslations("activities");
  const options = Object.values(ActivityPriority).map((item) => ({
    label: t(`schema.priority.options.${item}`),
    value: item,
  }));
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["activities_count_priority", begin, end, params.cropId],
    queryFn: async () => {
      const url = queryString.stringifyUrl(
        {
          url: `/api/activities/count_priority`,
          query: {
            begin,
            end,
            cropId: params.cropId,
          },
        },
        {
          skipEmptyString: true,
          skipNull: true,
        }
      );
      const res = await fetch(url);
      return (await res.json()) as ActivityPriorityCount[];
    },
  });

  if (isPending) {
    return <Skeleton className="w-32 h-8"></Skeleton>;
  }
  if (isError) {
    return (
      <ErrorButton
        title={t("search.faceted.priority.error")}
        refresh={refetch}
      />
    );
  }
  const counts = data.reduce(
    (obj, item) => ({ ...obj, [item.priority]: item._count }),
    {}
  );
  return (
    <FacetedFilterStringButton
      options={options}
      column="priority"
      title={t("search.faceted.priority.placeholder")}
      counts={counts}
    />
  );
};

export const ActivitiesTableFaceted = () => {
  return (
    <div className="flex gap-2 my-2 lg:flex-row flex-col lg:items-center items-start">
      <DatePickerWithRangeButton />
      <div className="flex gap-2 justify-start">
        <ActivitiesFacetedStatus />
        <ActivitiesFacetedPriority />
      </div>
    </div>
  );
};
export const ActivitiesSelectCreatedBy = () => {
  const { updateSearchParam, initialParam = "assignedTo" } =
    useUpdateSearchParam("type", "assignedTo");

  const { isFarmer } = useCurrentStaffRole();
  const selectData: SelectData[] = [
    {
      label: "Assigned To",
      value: "assignedTo",
    },
    {
      label: "Created By",
      value: "createdBy",
    },
  ];
  return (
    <div className="lg:w-[200px] w-full">
      <SelectOptions
        options={selectData}
        onChange={updateSearchParam}
        defaultValue={initialParam}
        placeholder="Select type"
        disabledValues={isFarmer ? ["createdBy"] : []}
      />
    </div>
  );
};
