import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EquipmentDetailEditButton } from "./equipment-detail-edit-button";
import { EquipmentDetailDeleteButton } from "./equipment-detail-delete-button";
import { MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { EquipmentDetailTable } from "@/types";
interface EquipmentDetailsTableActionProps {
  data: EquipmentDetailTable;
}
export const EquipmentDetailsTableAction = ({
  data,
}: EquipmentDetailsTableActionProps) => {
  const t = useTranslations("equipmentDetails.form");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-fit">
        <DropdownMenuItem>
          <EquipmentDetailEditButton data={data} label={t("edit.label")} />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <EquipmentDetailDeleteButton data={data} label={t("destroy.label")} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
