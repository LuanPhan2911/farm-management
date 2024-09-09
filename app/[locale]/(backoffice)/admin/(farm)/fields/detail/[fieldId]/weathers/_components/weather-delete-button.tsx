"use client";

import { destroy } from "@/actions/weather";
import { Button } from "@/components/ui/button";
import { useAlertDialog } from "@/stores/use-alert-dialog";
import { WeatherTable } from "@/types";

import { Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

interface WeatherDeleteButtonProps {
  data: WeatherTable;
  label: string;
}
export const WeatherDeleteButton = ({
  data,
  label,
}: WeatherDeleteButtonProps) => {
  const { id } = data;
  const { onOpen, onClose } = useAlertDialog();
  const t = useTranslations("weathers");
  const onConfirm = async () => {
    destroy(id)
      .then(({ message, ok }) => {
        if (ok) {
          toast.success(message);
        } else {
          toast.error(message);
        }
      })
      .catch((error: Error) => {
        toast.error(t("status.failure.destroy"));
      })
      .finally(() => {
        onClose();
      });
  };
  return (
    <Button
      className="w-full"
      onClick={() =>
        onOpen({
          title: t("form.destroy.title"),
          description: t("form.destroy.description"),
          onConfirm,
        })
      }
      size={"sm"}
      variant={"destroy"}
      disabled={data.confirmed}
    >
      <Trash className="h-6 w-6 mr-2" />
      {label}
    </Button>
  );
};
