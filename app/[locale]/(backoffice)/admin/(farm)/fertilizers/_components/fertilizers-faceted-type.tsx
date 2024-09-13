"use client";

import { ErrorButton } from "@/components/buttons/error-button";
import { FacetedFilterStringButton } from "@/components/buttons/faceted-filter-string-button";
import { QueryProvider } from "@/components/providers/query-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { FertilizerTypeCount } from "@/types";
import { FertilizerType } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import queryString from "query-string";

const FertilizersFacetedStatus = () => {
  const searchParams = useSearchParams();
  const filterString = searchParams.get("filterString");
  const t = useTranslations("fertilizers");
  const options = Object.values(FertilizerType).map((item) => ({
    label: t(`schema.type.options.${item}`),
    value: item,
  }));
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["fertilizers_count_type", filterString],
    queryFn: async () => {
      const url = queryString.stringifyUrl(
        {
          url: `/api/fertilizers/count_type`,
          query: {
            filterString,
          },
        },
        {
          skipEmptyString: true,
          skipNull: true,
        }
      );
      const res = await fetch(url);
      return (await res.json()) as FertilizerTypeCount[];
    },
  });

  if (isPending) {
    return <Skeleton className="w-32 h-8"></Skeleton>;
  }
  if (isError) {
    return (
      <ErrorButton title={t("search.faceted.type.error")} refresh={refetch} />
    );
  }
  const counts = data.reduce(
    (obj, item) => ({ ...obj, [item.type]: item._count }),
    {}
  );
  return (
    <FacetedFilterStringButton
      options={options}
      column="type"
      title={t("search.faceted.type.placeholder")}
      counts={counts}
    />
  );
};

export const FertilizersFacetedTypeWithQueryClient = () => {
  return (
    <QueryProvider>
      <FertilizersFacetedStatus />
    </QueryProvider>
  );
};
