"use client";
import { completeActivity } from "@/actions/activity";
import { ActionButton } from "@/components/buttons/action-button";
import { ActionButtonWithConfirmCode } from "@/components/buttons/action-button-with-confirm-code";
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
    <ActionButtonWithConfirmCode
      actionFn={() => completeActivity(activityId)}
      label={t("complete.label")}
      title={t("complete.title")}
      description={t("complete.description")}
      variant={"success"}
      size={"sm"}
      disabled={disabled}
      confirmCode="FINISH_ACTIVITY"
    />
  );
};
