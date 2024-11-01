import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { EquipmentDetailTable } from "@/types";
import { DestroyButton } from "@/components/buttons/destroy-button";
import { destroy } from "@/actions/material-usage";
import { EditButton } from "@/components/buttons/edit-button";
import { DetailButton } from "@/components/buttons/detail-button";
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
          <DetailButton
            href={`equipments/detail/${data.equipmentId}/details/${data.id}/usages`}
            className="w-full"
            label={t("viewUsage.label")}
          />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <EditButton
            inltKey="equipmentDetails"
            type="equipmentDetail.edit"
            data={{
              equipmentDetail: data,
            }}
            className="w-full"
          />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <DestroyButton
            destroyFn={destroy}
            id={data.id}
            inltKey="equipmentDetails"
            className="w-full"
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
