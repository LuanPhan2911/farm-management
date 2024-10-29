import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { JobEditButton } from "./job-edit-button";
import { MoreHorizontal } from "lucide-react";

import { useTranslations } from "next-intl";
import { JobTable } from "@/types";
import { DestroyButton } from "@/components/buttons/destroy-button";
import { destroy } from "@/actions/job";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
interface JobsTableActionProps {
  data: JobTable;
}
export const JobsTableAction = ({ data }: JobsTableActionProps) => {
  const t = useTranslations("jobs.form");
  const { isSuperAdmin } = useCurrentStaffRole();
  const disabled = !isSuperAdmin;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-fit">
        <DropdownMenuItem>
          <JobEditButton data={data} label={t("edit.label")} />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <DestroyButton
            destroyFn={destroy}
            id={data.id}
            inltKey="jobs"
            className="w-full"
            disabled={disabled}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
