import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UnitEditButton } from "./unit-edit-button";
import { UnitDeleteButton } from "./unit-delete-button";
import { MoreHorizontal } from "lucide-react";
import { Unit } from "@prisma/client";
import { useTranslations } from "next-intl";
interface UnitsTableActionProps {
  data: Unit;
}
export const UnitsTableAction = ({ data }: UnitsTableActionProps) => {
  const tAction = useTranslations("units.table.action");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-40">
        <DropdownMenuLabel>{tAction("label")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <UnitEditButton data={data} label={tAction("edit")} />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <UnitDeleteButton data={data} label={tAction("destroy")} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
