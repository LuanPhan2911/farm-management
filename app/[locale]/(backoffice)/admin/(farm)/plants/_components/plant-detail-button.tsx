"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/navigation";
import { PlantTable } from "@/types";
interface PlantDetailButtonProps {
  data: PlantTable;
  label: string;
}
export const PlantDetailButton = ({ data, label }: PlantDetailButtonProps) => {
  return (
    <Link href={`/admin/plants/detail/${data.id}`}>
      <Button variant={"edit"} size={"sm"}>
        {label}
      </Button>
    </Link>
  );
};
