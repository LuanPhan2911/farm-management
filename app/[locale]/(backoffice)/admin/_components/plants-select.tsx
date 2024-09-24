import { ErrorButton } from "@/components/buttons/error-button";
import { SelectItemContent } from "@/components/form/select-item";
import { QueryProvider } from "@/components/providers/query-provider";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { PlantSelect } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface PlantsSelectProps {
  onChange: (value: string) => void;
  defaultValue?: string;
  disabled?: boolean;
  label: string;
  notFound: string;
  errorLabel: string;
  className?: string;
}
const PlantsSelect = ({
  defaultValue,
  errorLabel,
  label,
  notFound,
  onChange,
  disabled,
}: PlantsSelectProps) => {
  const [key, setKey] = useState(+new Date());
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["plants"],
    queryFn: async () => {
      const res = await fetch("/api/plants/select");
      return (await res.json()) as PlantSelect[];
    },
  });
  useEffect(() => {
    if (!defaultValue) {
      setKey(+new Date());
    }
  }, [defaultValue]);
  if (isPending) {
    return <Skeleton className="w-full h-12"></Skeleton>;
  }
  if (isError) {
    return <ErrorButton title={errorLabel} refresh={refetch} />;
  }

  return (
    <Select
      onValueChange={onChange}
      value={defaultValue}
      disabled={disabled}
      key={key}
    >
      <SelectTrigger>
        <SelectValue placeholder={label} />
      </SelectTrigger>

      <SelectContent>
        {data.map(({ id, imageUrl, name }) => {
          return (
            <SelectItem key={id} value={id}>
              <SelectItemContent imageUrl={imageUrl} title={name} />
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export const PlantsSelectWithQueryClient = (props: PlantsSelectProps) => {
  return (
    <QueryProvider>
      <PlantsSelect {...props} />
    </QueryProvider>
  );
};
