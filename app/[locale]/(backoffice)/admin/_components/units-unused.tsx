"use client";

import { ErrorButton } from "@/components/buttons/error-button";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UnitUnusedCount } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

interface UnitsUnusedProps {}
export const UnitsUnused = ({}: UnitsUnusedProps) => {
  const t = useTranslations("units.unused");
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["unused_units"],
    queryFn: async () => {
      const res = await fetch("/api/units/delete_unused/count");
      return (await res.json()) as UnitUnusedCount;
    },
  });
  if (isPending) {
    return <Skeleton className="h-24 w-full" />;
  }
  if (isError) {
    return <ErrorButton refresh={refetch} title={t("error")} />;
  }
  return (
    <div className="flex flex-col border-t border-b py-2">
      <div className="text-md">{t("title")}</div>
      <Button size={"sm"} variant={"ghost"} className="justify-start" disabled>
        {t("fields.floatUnit")}: {data.floatUnit}
      </Button>
      <Button size={"sm"} variant={"ghost"} className="justify-start" disabled>
        {t("fields.intUnit")}: {data.intUnit}
      </Button>
    </div>
  );
};
