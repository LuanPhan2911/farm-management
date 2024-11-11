"use client";

import { finishCrop } from "@/actions/crop";
import { ActionButton } from "@/components/buttons/action-button";
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
  return (
    <ActionButton
      actionFn={() => finishCrop(id)}
      label={t("finish.label")}
      title={t("finish.title")}
      description={t("finish.description")}
      variant={"success"}
      size={"sm"}
      disabled={disabled}
    />
  );
};
