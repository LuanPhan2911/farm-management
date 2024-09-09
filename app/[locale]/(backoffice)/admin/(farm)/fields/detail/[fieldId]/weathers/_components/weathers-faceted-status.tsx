"use client";

import { ErrorButton } from "@/components/buttons/error-button";
import { FacetedFilterStringButton } from "@/components/buttons/faceted-filter-string-button";
import { QueryProvider } from "@/components/providers/query-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { WeatherStatusCount } from "@/types";
import { WeatherStatus } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import queryString from "query-string";

const WeathersFacetedStatus = () => {
  const { fieldId } = useParams<{
    fieldId: string;
  }>();
  const searchParams = useSearchParams();
  const begin = searchParams.get("begin");
  const end = searchParams.get("end");
  const filterString = searchParams.get("filterString");
  const t = useTranslations("weathers");
  const options = Object.values(WeatherStatus).map((item) => ({
    label: t(`schema.status.options.${item}`),
    value: item,
  }));
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["weathers_count_status", filterString, begin, end],
    queryFn: async () => {
      const url = queryString.stringifyUrl(
        {
          url: `/api/fields/${fieldId}/weathers/count_status`,
          query: {
            filterString,
            begin,
            end,
          },
        },
        {
          skipEmptyString: true,
          skipNull: true,
        }
      );
      const res = await fetch(url);
      return (await res.json()) as WeatherStatusCount[];
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

export const WeathersFacetedStatusWithQueryClient = () => {
  return (
    <QueryProvider>
      <WeathersFacetedStatus />
    </QueryProvider>
  );
};
