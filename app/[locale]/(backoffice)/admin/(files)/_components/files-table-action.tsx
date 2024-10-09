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
interface FilesTableActionProps {
  data: FileWithOwner;
  currentStaff: Staff;
}
export const FilesTableAction = ({
  data,
  currentStaff,
}: FilesTableActionProps) => {
  const t = useTranslations("files.form");
  const { isSuperAdmin } = useRole(currentStaff.role);
  const isOwner = currentStaff.id === data.owner.id || isSuperAdmin;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-fit">
        <DropdownMenuItem>
          <FileEditNameButton
            data={data}
            label={t("editName.label")}
            disabled={!isOwner}
          />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <FileCopyButton
            data={data}
            label={t("copy.label")}
            disabled={data.isPublic}
          />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <DownloadButtonWithUrl
            name={data.name}
            url={data.url}
            label={t("download.label")}
            className="w-full"
            variant={"outline"}
          />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <FileEditDeletedButton
            data={data}
            label={t("editDeleted.label")}
            disabled={!isOwner}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
interface FilesTableActionContextMenuProps extends PropsWithChildren {
  data: FileWithOwner;
  currentStaff: Staff;
}
export const FilesTableActionContextMenu = ({
  currentStaff,
  data,
  children,
}: FilesTableActionContextMenuProps) => {
  const t = useTranslations("files.form");
  const { isSuperAdmin } = useRole(currentStaff.role);
  const isOwner = currentStaff.id === data.owner.id || isSuperAdmin;

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-40">
        <ContextMenuItem>
          <FileEditNameButton
            data={data}
            label={t("editName.label")}
            disabled={!isOwner}
          />
        </ContextMenuItem>
        <ContextMenuItem>
          <FileCopyButton
            data={data}
            label={t("copy.label")}
            disabled={data.isPublic}
          />
        </ContextMenuItem>
        <ContextMenuItem>
          <DownloadButtonWithUrl
            name={data.name}
            url={data.url}
            label={t("download.label")}
            className="w-full justify-start"
            variant={"outline"}
          />
        </ContextMenuItem>
        <ContextMenuItem>
          <FileEditDeletedButton
            data={data}
            label={t("editDeleted.label")}
            disabled={!isOwner}
          />
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
