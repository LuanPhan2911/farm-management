"use client";
import { completeActivity } from "@/actions/activity";
import { ActionButton } from "@/components/buttons/action-button";
import { useTranslations } from "next-intl";

interface ActivityEditStatusButtonProps {
  activityId: string;
  disabled?: boolean;
}
export const ActivityCompletedButton = ({
  activityId,
  disabled,
}: ActivityEditStatusButtonProps) => {
  const t = useTranslations("activities.form");
  return (
    <ActionButton
      actionFn={() => completeActivity(activityId, "COMPLETED")}
      label={t("complete.label")}
      title={t("complete.title")}
      description={t("complete.description")}
      variant={"success"}
      size={"sm"}
      disabled={disabled}
    />
  );
};
export const ActivityCancelButton = ({
  activityId,
  disabled,
}: ActivityEditStatusButtonProps) => {
  const t = useTranslations("activities.form");
  return (
    <ActionButton
      actionFn={() => completeActivity(activityId, "CANCELLED")}
      label={t("cancel.label")}
      title={t("cancel.title")}
      description={t("cancel.description")}
      variant={"destructive"}
      size={"sm"}
      disabled={disabled}
    />
  );
};
