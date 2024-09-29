"use client";

import { editPaused } from "@/actions/schedule";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useAlertDialog } from "@/stores/use-alert-dialog";
import { ScheduleResponse } from "@/types";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

interface SchedulePauseStatusProps {
  data: ScheduleResponse;
}
export const SchedulePauseButton = ({ data }: SchedulePauseStatusProps) => {
  const { onOpen, setPending, isPending, onClose } = useAlertDialog();

  const t = useTranslations("schedules");
  const onClick = () => {
    setPending(true);
    editPaused(
      {
        ...data,
        paused: !data.paused,
      },
      data.id
    )
      .then(({ message, ok }) => {
        if (ok) {
          toast.success(message);
        } else {
          toast.error(message);
        }
      })
      .catch((error: Error) => {
        toast.error(t("status.failure.editPaused"));
      })
      .finally(() => {
        onClose();
      });
  };

  return (
    <div className="flex flex-col gap-2">
      <Switch
        checked={data.paused}
        onClick={(e) => {
          e.stopPropagation();
          onOpen({
            title: t("form.editPaused.title"),
            description: t("form.editPaused.description"),
            onConfirm: () => onClick(),
          });
        }}
        disabled={isPending}
      />
    </div>
  );
};
