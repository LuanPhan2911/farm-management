"use client";

import { ErrorButton } from "@/components/buttons/error-button";
import { ComboBoxDefault, ComboBoxData } from "@/components/form/combo-box";
import { Skeleton } from "@/components/ui/skeleton";
import { JobSelect } from "@/types";
import { useQuery } from "@tanstack/react-query";

interface JobsSelectProps {
  onChange: (value: string | undefined) => void;
  defaultValue?: string;
  disabled?: boolean;
  placeholder: string;
  notFound: string;
  error: string;
}
export const JobsSelect = ({
  defaultValue,
  error,
  notFound,
  onChange,
  placeholder,
  disabled,
}: JobsSelectProps) => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["jobs_select"],
    queryFn: async () => {
      const res = await fetch("/api/jobs/select");
      return (await res.json()) as JobSelect[];
    },
  });

  if (isPending) {
    return <Skeleton className="h-10 w-60" />;
  }
  if (isError) {
    return <ErrorButton refresh={refetch} title={error} />;
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
      notFound={notFound}
      placeholder={placeholder}
      onChange={onChange}
      defaultValue={defaultValue}
      disabled={disabled}
    />
  );
};
