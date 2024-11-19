"use client";

import { finishCrop } from "@/actions/crop";
import { ActionButtonWithConfirmCode } from "@/components/buttons/action-button-with-confirm-code";

import { useTranslations } from "next-intl";

interface CropEditStatusButtonProps {
  id: string;
  disabled?: boolean;
}
export const CropFinishButton = ({
  id,
  disabled,
}: CropEditStatusButtonProps) => {
  const t = useTranslations("crops.form");
  const confirmCode = "FINISH_CROP";
  return (
    <ActionButtonWithConfirmCode
      actionFn={() => finishCrop(id)}
      label={t("finish.label")}
      title={t("finish.title")}
      description={t("finish.description")}
      variant={"success"}
      size={"sm"}
      disabled={disabled}
      confirmCode={confirmCode}
    />
  );
};
