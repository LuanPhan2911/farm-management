import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

import { useTranslations } from "next-intl";
import { ApplicantStaffCreateButton } from "./applicant-staff-create-button";
import { ApplicantTable } from "@/types";
import { destroy } from "@/actions/applicant";
import { DestroyButton } from "@/components/buttons/destroy-button";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
interface ApplicantsTableActionProps {
  data: ApplicantTable;
}
export const ApplicantsTableAction = ({ data }: ApplicantsTableActionProps) => {
  const t = useTranslations("applicants.form");
  const { isSuperAdmin } = useCurrentStaffRole();
  const canCreate = isSuperAdmin && data.status === "NEW";
  const canDelete = isSuperAdmin;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-fit">
        <DropdownMenuItem>
          <ApplicantStaffCreateButton
            data={data}
            label={t("createStaff.label")}
            disabled={!canCreate}
          />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <DestroyButton
            destroyFn={destroy}
            id={data.id}
            inltKey="applicants"
            className="w-full"
            disabled={!canDelete}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
