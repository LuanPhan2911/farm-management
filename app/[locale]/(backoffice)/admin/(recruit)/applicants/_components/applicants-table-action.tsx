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
import { ApplicantStaffCreateButton } from "./applicant-staff-create-button";
interface ApplicantsTableActionProps {
  data: Applicant;
}
export const ApplicantsTableAction = ({ data }: ApplicantsTableActionProps) => {
  const t = useTranslations("applicants.form");
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
          />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ApplicantDeleteButton data={data} label={t("destroy.label")} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
