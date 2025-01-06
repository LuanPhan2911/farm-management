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

import { EditButton } from "@/components/buttons/edit-button";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import { destroy } from "@/actions/equipment-detail";
import { canUpdateEquipmentDetail } from "@/lib/permission";
import { DestroyButtonWithConfirmCode } from "@/components/buttons/destroy-button-with-confirm-code";
interface EquipmentDetailsTableActionProps {
  data: EquipmentDetailTable;
}
export const EquipmentDetailsTableAction = ({
  data,
}: EquipmentDetailsTableActionProps) => {
  const t = useTranslations("equipmentDetails.form");

  const { isOnlyAdmin, isSuperAdmin } = useCurrentStaffRole();
  const canEdit = canUpdateEquipmentDetail(data.status) && isOnlyAdmin;
  const canDelete = canEdit && isSuperAdmin;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-fit">
        <DropdownMenuItem>
          <EditButton
            inltKey="equipmentDetails"
            type="equipmentDetail.edit"
            disabled={!canEdit}
            data={{
              equipmentDetail: data,
            }}
            className="w-full"
          />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <DestroyButtonWithConfirmCode
            destroyFn={destroy}
            id={data.id}
            inltKey="equipmentDetails"
            className="w-full"
            disabled={!canDelete}
            confirmCode="DELETE_EQUIPMENT"
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
