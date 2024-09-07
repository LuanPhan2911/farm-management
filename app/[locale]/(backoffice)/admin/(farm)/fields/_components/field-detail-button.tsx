"use client";
import { Button } from "@/components/ui/button";
import { Link } from "@/navigation";
import { FieldWithUnit } from "@/types";
interface FieldDetailButtonProps {
  data: FieldWithUnit;
  label: string;
}
export const FieldDetailButton = ({ data, label }: FieldDetailButtonProps) => {
  return (
    <Link href={`/admin/fields/detail/${data.id}`}>
      <Button variant={"edit"} size={"sm"}>
        {label}
      </Button>
    </Link>
  );
};
