"use client";

import { editConfirmed } from "@/actions/soil";
import { Switch } from "@/components/ui/switch";
import { useAlertDialog } from "@/stores/use-alert-dialog";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface SoilConfirmButtonProps {
  soilId: string;
  confirmed: boolean;
}
export const SoilConfirmButton = ({
  soilId,
  confirmed,
}: SoilConfirmButtonProps) => {
  const { onOpen } = useAlertDialog();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("soils");
  const [status, setStatus] = useState(confirmed);
  const onClick = () => {
    startTransition(() => {
      editConfirmed(soilId)
        .then(({ message, ok }) => {
          if (ok) {
            toast.success(message);
            setStatus(true);
          } else {
            toast.error(message);
          }
        })
        .catch((error: Error) => {
          toast.error(t("status.failure.editConfirmed"));
        });
    });
  };
  return (
    <Switch
      checked={status}
      onCheckedChange={() =>
        onOpen({
          title: t("form.editConfirmed.title"),
          description: t("form.editConfirmed.description"),
          onConfirm: onClick,
        })
      }
      disabled={isPending || status}
    />
  );
};
