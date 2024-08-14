import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { JobEditButton } from "./job-edit-button";
import { JobDeleteButton } from "./job-delete-button";
import { MoreHorizontal } from "lucide-react";
import { Job } from "@prisma/client";
import { useTranslations } from "next-intl";
interface JobsTableActionProps {
  data: Job;
}
export const JobsTableAction = ({ data }: JobsTableActionProps) => {
  const tAction = useTranslations("jobs.table.action");
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
          <JobEditButton data={data} label={tAction("edit")} />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <JobDeleteButton data={data} label={tAction("destroy")} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
