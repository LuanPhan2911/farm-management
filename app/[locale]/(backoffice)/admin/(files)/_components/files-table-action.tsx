"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, MoreHorizontal, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { FileWithOwner } from "@/types";
import { DownloadButtonWithUrl } from "@/components/buttons/download-button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { PropsWithChildren } from "react";
import { FileEditNameButton } from "./file-edit-name-button";
import { useCurrentStaff } from "@/hooks/use-current-staff";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import { ActionButton } from "@/components/buttons/action-button";
import { copy, editDeleted } from "@/actions/file";
interface FilesTableActionProps {
  data: FileWithOwner;
}
export const FilesTableAction = ({ data }: FilesTableActionProps) => {
  const t = useTranslations("files.form");
  const { currentStaff } = useCurrentStaff();
  const { isSuperAdmin } = useCurrentStaffRole();
  const isOwner = currentStaff?.id === data.owner.id;
  const disabled = !isSuperAdmin && !isOwner;

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
            disabled={disabled}
          />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ActionButton
            actionFn={() =>
              copy({
                name: data.name,
                ownerId: currentStaff?.id || data.ownerId,
                type: data.type,
                url: data.url,
                isPublic: false,
                orgId: null,
              })
            }
            title={t("copy.label")}
            description={t("copy.description")}
            label={t("copy.label")}
            className="w-full"
            icon={Copy}
            size={"sm"}
            variant={"outline"}
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
          <ActionButton
            actionFn={() =>
              editDeleted(data.id, {
                deleted: true,
              })
            }
            title={t("editDeleted.label")}
            description={t("editDeleted.description")}
            label={t("editDeleted.label")}
            className="w-full"
            icon={Trash}
            size={"sm"}
            variant={"destroy"}
            disabled={disabled}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
interface FilesTableActionContextMenuProps extends PropsWithChildren {
  data: FileWithOwner;
}
export const FilesTableActionContextMenu = ({
  data,
  children,
}: FilesTableActionContextMenuProps) => {
  const t = useTranslations("files.form");
  const { currentStaff } = useCurrentStaff();
  const { isSuperAdmin } = useCurrentStaffRole();
  const isOwner = currentStaff?.id === data.owner.id;
  const disabled = !isSuperAdmin && !isOwner;

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-40">
        <ContextMenuItem>
          <FileEditNameButton
            data={data}
            label={t("editName.label")}
            disabled={disabled}
          />
        </ContextMenuItem>
        <ContextMenuItem>
          <ActionButton
            actionFn={() =>
              copy({
                name: data.name,
                ownerId: currentStaff?.id || data.ownerId,
                type: data.type,
                url: data.url,
                isPublic: false,
                orgId: null,
              })
            }
            title={t("copy.label")}
            description={t("copy.description")}
            label={t("copy.label")}
            className="w-full"
            icon={Copy}
            size={"sm"}
            variant={"outline"}
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
          <ActionButton
            actionFn={() =>
              editDeleted(data.id, {
                deleted: true,
              })
            }
            title={t("editDeleted.label")}
            description={t("editDeleted.description")}
            label={t("editDeleted.label")}
            className="w-full"
            icon={Trash}
            size={"sm"}
            variant={"destroy"}
            disabled={disabled}
          />
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
