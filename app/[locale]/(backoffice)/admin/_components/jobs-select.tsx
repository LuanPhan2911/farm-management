"use client";

import { ErrorButton } from "@/components/buttons/error-button";
import { ComboBox, ComboBoxData } from "@/components/combobox";
import { QueryProvider } from "@/components/providers/query-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { usePathname, useRouter } from "@/navigation";
import { JobSelect } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

interface JobsSelectProps {}
const JobsSelect = ({}: JobsSelectProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("applicants.search");
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const res = await fetch("/api/jobs/select");
      return (await res.json()) as JobSelect[];
    },
  });
  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (!value) {
      params.delete("filter");
    } else {
      params.set("filter", value);
    }

    router.replace(`${pathname}?${params.toString()}`);
  };
  if (isPending) {
    return <Skeleton className="h-12 w-full" />;
  }
  if (isError) {
    return (
      <ErrorButton
        refresh={refetch}
        title="Something went wrong went load jobs"
      />
    );
  }
  const options: ComboBoxData[] = data.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
  return (
    <ComboBox
      data={options}
      notFound={t("comboBox.notFound")}
      label={t("comboBox.label")}
      onChange={handleChange}
      isSearch={false}
    />
  );
};

export const JobSelectWithQueryClient = (props: JobsSelectProps) => {
  return (
    <QueryProvider>
      <JobsSelect {...props} />
    </QueryProvider>
  );
};
