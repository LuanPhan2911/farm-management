"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SoilTable } from "@/types";
import {
  Check,
  Edit,
  LucideIcon,
  MoreHorizontal,
  Pin,
  PinOff,
  Trash,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { SoilEditButton } from "./soil-edit-button";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import { useAuth } from "@clerk/nextjs";
import { DestroyButton } from "@/components/buttons/destroy-button";
import {
  destroy,
  destroyManyUnConfirmed,
  editConfirmed,
  editManyConfirmed,
  editPinned,
} from "@/actions/soil";
import { ConfirmButton } from "@/components/buttons/confirm-button";
import { useParams } from "next/navigation";
import { ActionButton } from "@/components/buttons/action-button";
import { DownloadButton } from "@/components/buttons/download-button";
import { EditStatusButton } from "@/components/buttons/edit-status-button";
interface SoilsTableActionProps {
  data: SoilTable;
}
export const SoilsTableAction = ({ data }: SoilsTableActionProps) => {
  const { isOnlyAdmin } = useCurrentStaffRole();
  const { has } = useAuth();
  const isAdminOrg = has?.({ role: "org:field" }) || false;
  const canUpdate = !data.confirmed || isAdminOrg || isOnlyAdmin;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-fit">
        <DropdownMenuItem>
          <SoilPinnedButton data={data} isButton className="w-full" />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <SoilEditButton data={data} />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <SoilConfirmButton data={data} isButton disabled={!canUpdate} />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <DestroyButton
            id={data.id}
            destroyFn={destroy}
            inltKey="soils"
            className="w-full"
            disabled={!canUpdate}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
interface SoilConfirmButtonProps {
  data: SoilTable;
  isButton?: boolean;
  disabled?: boolean;
}
export const SoilConfirmButton = ({
  data,
  isButton = false,
  disabled,
}: SoilConfirmButtonProps) => {
  const t = useTranslations("soils.form");

  return (
    <ConfirmButton
      disabled={disabled}
      checked={data.confirmed}
      confirmFn={() => editConfirmed(data.id, !data.confirmed)}
      title={t("editConfirmed.title")}
      label={t("editConfirmed.label")}
      description={t("editConfirmed.description")}
      icon={Check}
      isButton={isButton}
      size={"sm"}
      variant={"cyan"}
      className="w-full"
    />
  );
};

export const SoilsConfirmedAllButton = () => {
  const t = useTranslations("soils.form");
  const params = useParams<{
    fieldId: string;
  }>();

  return (
    <ActionButton
      actionFn={() => editManyConfirmed(params!.fieldId)}
      title={t("editManyConfirmed.title")}
      label={t("editManyConfirmed.label")}
      description={t("editManyConfirmed.description")}
      icon={Edit}
      size={"sm"}
      variant={"edit"}
    />
  );
};

export const SoilDeleteManyUnConfirmedButton = () => {
  const t = useTranslations("soils.form");
  const params = useParams<{
    fieldId: string;
  }>();

  return (
    <ActionButton
      actionFn={() => destroyManyUnConfirmed(params!.fieldId)}
      title={t("destroyManyConfirmed.title")}
      label={t("destroyManyConfirmed.label")}
      description={t("destroyManyConfirmed.description")}
      icon={Trash}
      size={"sm"}
      variant={"destroy"}
    />
  );
};

export const SoilsExportButton = () => {
  const t = useTranslations("soils.form.export");
  const params = useParams<{
    fieldId: string;
  }>();
  const apiEndpoint = `/api/fields/${params!.fieldId}/soils`;
  return (
    <DownloadButton
      apiEndpoint={apiEndpoint}
      filename="soils"
      label={t("label")}
    />
  );
};

interface SoilPinnedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  data: SoilTable;
  isButton?: boolean;
}
export const SoilPinnedButton = ({
  data,
  isButton = false,
  className,
}: SoilPinnedButtonProps) => {
  const t = useTranslations("soils.form");

  const Icon: LucideIcon = data.pinned ? PinOff : Pin;
  return (
    <EditStatusButton
      editValueFn={() => editPinned(data.id, !data.pinned)}
      icon={Icon}
      label={t("editPinned.label")}
      isButton={isButton}
      className={className}
      variant={"purple"}
      size={"sm"}
    />
  );
};
