"use client";
import { Button } from "@/components/ui/button";
import { Link } from "@/navigation";
import { FieldWithUnit } from "@/types";
interface FieldDetailButtonProps {
  data: FieldWithUnit;
}
export const FieldDetailButton = ({ data }: FieldDetailButtonProps) => {
  return (
    <Link href={`/admin/fields/detail/${data.id}`}>
      <Button variant={"edit"} size={"sm"}>
        View detail
      </Button>
    </Link>
  );
};
