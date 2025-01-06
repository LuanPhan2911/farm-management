"use client";
import { editPinned } from "@/actions/weather";
import { Check, LucideIcon, Pin, PinOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WeatherTable } from "@/types";
import { MoreHorizontal, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { WeatherEditButton } from "./weather-edit-button";
import {
  destroy,
  editConfirmed,
  editManyConfirmed,
  destroyManyUnConfirmed,
} from "@/actions/weather";
import { ActionButton } from "@/components/buttons/action-button";
import { ConfirmButton } from "@/components/buttons/confirm-button";
import { Edit } from "lucide-react";
import { useParams } from "next/navigation";
import { DestroyButton } from "@/components/buttons/destroy-button";
import { DownloadButton } from "@/components/buttons/download-button";
import { EditStatusButton } from "@/components/buttons/edit-status-button";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import { useAuth } from "@clerk/nextjs";

interface WeathersTableActionProps {
  data: WeatherTable;
}
export const WeathersTableAction = ({ data }: WeathersTableActionProps) => {
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
          <WeatherPinnedButton data={data} isButton className="w-full" />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <WeatherEditButton data={data} />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <WeatherConfirmButton data={data} isButton disabled={!canUpdate} />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <DestroyButton
            id={data.id}
            destroyFn={destroy}
            inltKey="weathers"
            className="w-full"
            disabled={!canUpdate}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface WeatherConfirmButtonProps {
  data: WeatherTable;
  isButton?: boolean;
  disabled?: boolean;
}
export const WeatherConfirmButton = ({
  data,
  isButton = false,
  disabled,
}: WeatherConfirmButtonProps) => {
  const t = useTranslations("weathers.form");

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

export const WeathersConfirmedAllButton = () => {
  const t = useTranslations("weathers.form");
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

export const WeatherDeleteManyUnConfirmedButton = () => {
  const t = useTranslations("weathers.form");
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

export const WeathersExportButton = () => {
  const t = useTranslations("weathers.form.export");
  const params = useParams<{
    fieldId: string;
  }>();
  const apiEndpoint = `/api/fields/${params!.fieldId}/weathers`;
  return (
    <DownloadButton
      apiEndpoint={apiEndpoint}
      filename="weathers"
      label={t("label")}
    />
  );
};

interface WeatherPinnedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  data: WeatherTable;
  isButton?: boolean;
}
export const WeatherPinnedButton = ({
  data,
  isButton = false,
  className,
}: WeatherPinnedButtonProps) => {
  const t = useTranslations("weathers.form");

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
