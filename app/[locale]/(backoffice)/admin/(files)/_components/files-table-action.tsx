"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { FileWithOwner } from "@/types";
import { FileDeleteButton } from "./file-delete-button";
import { Staff } from "@prisma/client";
import { useRole } from "@/hooks/use-role";
import {
  DownloadButton,
  DownloadButtonWithUrl,
} from "@/components/buttons/download-button";
interface UnitsTableActionProps {
  data: FileWithOwner;
  currentStaff: Staff;
}
export const FilesTableAction = ({
  data,
  currentStaff,
}: UnitsTableActionProps) => {
  const t = useTranslations("files.form");
  const { isAdmin } = useRole(currentStaff.role);
  const isOwner = currentStaff.id === data.owner.id;
  const canDeleted = isAdmin || isOwner;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-fit">
        <DropdownMenuItem>
          <DownloadButtonWithUrl
            name={data.name}
            url={data.url}
            label={t("download.label")}
            className="w-full"
          />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <FileDeleteButton
            data={data}
            label={t("destroy.label")}
            disabled={!canDeleted}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
