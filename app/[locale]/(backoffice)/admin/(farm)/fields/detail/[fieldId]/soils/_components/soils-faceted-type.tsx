"use client";

import { ErrorButton } from "@/components/buttons/error-button";
import { FacetedFilterStringButton } from "@/components/buttons/faceted-filter-string-button";
import { QueryProvider } from "@/components/providers/query-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { SoilTypeCount } from "@/types";
import { SoilType } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import queryString from "query-string";

const SoilsFacetedType = () => {
  const { fieldId } = useParams<{
    fieldId: string;
  }>();
  const searchParams = useSearchParams();
  const begin = searchParams.get("begin");
  const end = searchParams.get("end");
  const filterString = searchParams.get("filterString");
  const t = useTranslations("soils");
  const options = Object.values(SoilType).map((item) => ({
    label: t(`schema.type.options.${item}`),
    value: item,
  }));
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["soils_count_type", filterString, begin, end],
    queryFn: async () => {
      const url = queryString.stringifyUrl(
        {
          url: `/api/fields/${fieldId}/soils/count_type`,
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
      return (await res.json()) as SoilTypeCount[];
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
export const SoilsFacetedTypeWithQueryClient = () => {
  return (
    <QueryProvider>
      <SoilsFacetedType />
    </QueryProvider>
  );
};
