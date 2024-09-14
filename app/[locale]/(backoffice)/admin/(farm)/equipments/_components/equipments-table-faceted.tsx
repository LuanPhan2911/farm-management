"use client";
import { ErrorButton } from "@/components/buttons/error-button";
import { FacetedFilterStringButton } from "@/components/buttons/faceted-filter-string-button";
import { QueryProvider } from "@/components/providers/query-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { EquipmentTypeCount } from "@/types";
import { EquipmentType } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import queryString from "query-string";

const EquipmentsFacetedType = () => {
  const searchParams = useSearchParams();
  const filterString = searchParams.get("filterString");
  const t = useTranslations("equipments");
  const options = Object.values(EquipmentType).map((item) => ({
    label: t(`schema.type.options.${item}`),
    value: item,
  }));
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["equipments_count_type", filterString],
    queryFn: async () => {
      const url = queryString.stringifyUrl(
        {
          url: `/api/equipments/count_type`,
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
      return (await res.json()) as EquipmentTypeCount[];
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

const EquipmentsFacetedTypeWithQueryClient = () => {
  return (
    <QueryProvider>
      <EquipmentsFacetedType />
    </QueryProvider>
  );
};

export const EquipmentsTableFaceted = () => {
  return (
    <div className="flex gap-2 my-2 lg:flex-row flex-col">
      <EquipmentsFacetedTypeWithQueryClient />
    </div>
  );
};
