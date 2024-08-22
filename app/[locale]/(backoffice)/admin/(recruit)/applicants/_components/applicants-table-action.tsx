import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ApplicantDeleteButton } from "./applicant-delete-button";
import { MoreHorizontal } from "lucide-react";

import { useTranslations } from "next-intl";
import { Applicant } from "@prisma/client";
import { ApplicantSetRoleButton } from "./applicant-set-role-button";
interface ApplicantsTableActionProps {
  data: Applicant;
}
export const ApplicantsTableAction = ({ data }: ApplicantsTableActionProps) => {
  const tAction = useTranslations("applicants.table.action");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-fit">
        <DropdownMenuLabel>{tAction("label")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <ApplicantSetRoleButton data={data} label={tAction("editRole")} />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ApplicantDeleteButton data={data} label={tAction("destroy")} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
