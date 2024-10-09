"use client";

import { ErrorButton } from "@/components/buttons/error-button";
import { ComboBoxDefault, ComboBoxData } from "@/components/form/combo-box";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpdateSearchParam } from "@/hooks/use-update-search-param";
import { JobSelect } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

interface JobsSelectProps {
  defaultValue?: string;
}
export const JobsSelect = ({ defaultValue }: JobsSelectProps) => {
  const t = useTranslations("applicants.search.comboBox.job");
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["jobs_select"],
    queryFn: async () => {
      const res = await fetch("/api/jobs/select");
      return (await res.json()) as JobSelect[];
    },
  });
  const { updateSearchParam } = useUpdateSearchParam("jobId");

  if (isPending) {
    return <Skeleton className="h-10 w-60" />;
  }
  if (isError) {
    return <ErrorButton refresh={refetch} title={t("error")} />;
  }
  const options: ComboBoxData[] = data.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });

  return (
    <ComboBoxDefault
      options={options}
      notFound={t("notFound")}
      label={t("label")}
      onChange={updateSearchParam}
      defaultValue={defaultValue}
    />
  );
};
