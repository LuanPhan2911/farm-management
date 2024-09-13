"use client";

import { ErrorButton } from "@/components/buttons/error-button";
import { FacetedFilterStringButton } from "@/components/buttons/faceted-filter-string-button";
import { QueryProvider } from "@/components/providers/query-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { PesticideToxicityLevelCount } from "@/types";
import { ToxicityLevel } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import queryString from "query-string";

const PesticidesFacetedToxicityLevel = () => {
  const searchParams = useSearchParams();
  const filterString = searchParams.get("filterString");
  const t = useTranslations("pesticides");
  const options = Object.values(ToxicityLevel).map((item) => ({
    label: t(`schema.toxicityLevel.options.${item}`),
    value: item,
  }));
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["pesticides_count_toxicity_level", filterString],
    queryFn: async () => {
      const url = queryString.stringifyUrl(
        {
          url: `/api/pesticides/count_toxicity_level`,
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
      return (await res.json()) as PesticideToxicityLevelCount[];
    },
  });

  if (isPending) {
    return <Skeleton className="w-32 h-8"></Skeleton>;
  }
  if (isError) {
    return (
      <ErrorButton
        title={t("search.faceted.toxicityLevel.error")}
        refresh={refetch}
      />
    );
  }
  const counts = data.reduce(
    (obj, item) => ({ ...obj, [item.toxicityLevel]: item._count }),
    {}
  );
  return (
    <FacetedFilterStringButton
      options={options}
      column="type"
      title={t("search.faceted.toxicityLevel.placeholder")}
      counts={counts}
    />
  );
};

export const PesticidesFacetedToxicityLevelWithQueryClient = () => {
  return (
    <QueryProvider>
      <PesticidesFacetedToxicityLevel />
    </QueryProvider>
  );
};
