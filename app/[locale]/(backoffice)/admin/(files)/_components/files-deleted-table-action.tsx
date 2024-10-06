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
import { FileEditDeletedButton } from "./file-edit-deleted-button";
import { Staff } from "@prisma/client";
import { useRole } from "@/hooks/use-role";
import { DownloadButtonWithUrl } from "@/components/buttons/download-button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { PropsWithChildren } from "react";
import { FileEditNameButton } from "./file-edit-name-button";
import { FileCopyButton } from "./file-copy-button";
import { FileRestoreButton } from "./file-restore-button";
import { FileDeleteButton } from "./file-delete-button";
interface FilesDeletedTableActionProps {
  data: FileWithOwner;
  currentStaff: Staff;
}
export const FilesDeletedTableAction = ({
  data,
  currentStaff,
}: FilesDeletedTableActionProps) => {
  const t = useTranslations("files.form");
  const isOwner = currentStaff.id === data.owner.id;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-fit">
        <DropdownMenuItem>
          <FileRestoreButton
            data={data}
            label={t("restore.label")}
            disabled={!isOwner}
          />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <FileDeleteButton
            data={data}
            label={t("destroy.label")}
            disabled={!isOwner}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
interface FilesDeletedTableActionContextMenuProps extends PropsWithChildren {
  data: FileWithOwner;
  currentStaff: Staff;
}
export const FilesDeletedTableActionContextMenu = ({
  currentStaff,
  data,
  children,
}: FilesDeletedTableActionContextMenuProps) => {
  const t = useTranslations("files.form");

  const isOwner = currentStaff.id === data.owner.id;

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-40">
        <ContextMenuItem>
          <FileRestoreButton
            data={data}
            label={t("restore.label")}
            disabled={!isOwner}
          />
        </ContextMenuItem>
        <ContextMenuItem>
          <FileDeleteButton
            data={data}
            label={t("destroy.label")}
            disabled={!isOwner}
          />
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
