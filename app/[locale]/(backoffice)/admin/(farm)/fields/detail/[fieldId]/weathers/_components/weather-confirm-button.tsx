"use client";

import { editConfirmed } from "@/actions/weather";
import { Switch } from "@/components/ui/switch";
import { useAlertDialog } from "@/stores/use-alert-dialog";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { toast } from "sonner";

interface WeatherConfirmButtonProps {
  weatherId: string;
  confirmed: boolean;
}
export const WeatherConfirmButton = ({
  weatherId,
  confirmed,
}: WeatherConfirmButtonProps) => {
  const { onOpen } = useAlertDialog();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("weathers");

  const onClick = () => {
    startTransition(() => {
      editConfirmed(weatherId)
        .then(({ message, ok }) => {
          if (ok) {
            toast.success(message);
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
      checked={confirmed}
      onCheckedChange={() =>
        onOpen({
          title: t("form.editConfirmed.title"),
          description: t("form.editConfirmed.description"),
          onConfirm: () => onClick(),
          isPending,
        })
      }
      disabled={isPending || confirmed}
    />
  );
};
