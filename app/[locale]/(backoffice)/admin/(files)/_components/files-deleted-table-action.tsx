"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Undo } from "lucide-react";
import { useTranslations } from "next-intl";
import { FileWithOwner } from "@/types";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { PropsWithChildren } from "react";
import { useCurrentStaff } from "@/hooks/use-current-staff";
import { DestroyButton } from "@/components/buttons/destroy-button";
import { destroy, editDeleted } from "@/actions/file";
import { ActionButton } from "@/components/buttons/action-button";
interface FilesDeletedTableActionProps {
  data: FileWithOwner;
}
export const FilesDeletedTableAction = ({
  data,
}: FilesDeletedTableActionProps) => {
  const t = useTranslations("files.form");
  const { currentStaff } = useCurrentStaff();
  const isOwner = currentStaff?.id === data.owner.id;
  const canRestore = isOwner && data.messageId === null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-fit">
        <DropdownMenuItem>
          <ActionButton
            actionFn={() =>
              editDeleted(data.id, {
                deleted: false,
              })
            }
            title={t("restore.label")}
            description={t("restore.description")}
            label={t("restore.label")}
            className="w-full"
            icon={Undo}
            size={"sm"}
            variant={"blue"}
            disabled={!canRestore}
          />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <DestroyButton
            destroyFn={destroy}
            id={data.id}
            inltKey="files"
            className="w-full"
            disabled={!isOwner}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
interface FilesDeletedTableActionContextMenuProps extends PropsWithChildren {
  data: FileWithOwner;
}
export const FilesDeletedTableActionContextMenu = ({
  data,
  children,
}: FilesDeletedTableActionContextMenuProps) => {
  const t = useTranslations("files.form");
  const { currentStaff } = useCurrentStaff();
  const isOwner = currentStaff?.id === data.owner.id;
  const canRestore = isOwner && data.messageId === null;
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-40">
        <ContextMenuItem>
          <ActionButton
            actionFn={() =>
              editDeleted(data.id, {
                deleted: false,
              })
            }
            title={t("restore.label")}
            description={t("restore.description")}
            label={t("restore.label")}
            className="w-full"
            icon={Undo}
            size={"sm"}
            variant={"blue"}
            disabled={!canRestore}
          />
        </ContextMenuItem>
        <ContextMenuItem>
          <DestroyButton
            destroyFn={destroy}
            id={data.id}
            inltKey="files"
            className="w-full"
            disabled={!isOwner}
          />
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
