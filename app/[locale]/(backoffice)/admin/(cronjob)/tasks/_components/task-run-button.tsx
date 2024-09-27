"use client";
import { run } from "@/actions/task";
import { Button } from "@/components/ui/button";
import { useAlertDialog } from "@/stores/use-alert-dialog";
import { TaskResponse } from "@/types";
import { Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { toast } from "sonner";

interface TaskRunButtonProps {
  data: TaskResponse;
  label: string;
}
export const TaskRunButton = ({ data, label }: TaskRunButtonProps) => {
  const { id } = data;
  const { onOpen, onClose, setPending } = useAlertDialog();
  const t = useTranslations("tasks");
  const disabled = data.status !== "queued";
  const onConfirm = async () => {
    setPending(true);
    run(id)
      .then(({ message, ok }) => {
        if (ok) {
          toast.success(message);
        } else {
          toast.error(message);
        }
      })
      .catch((error: Error) => {
        toast.error(t("status.failure.run"));
      })
      .finally(() => {
        onClose();
      });
  };
  return (
    <Button
      className="w-full"
      onClick={(e) => {
        e.stopPropagation();
        onOpen({
          title: t("form.run.title"),
          description: t("form.run.description"),
          onConfirm,
        });
      }}
      size={"sm"}
      variant={"blue"}
      disabled={disabled}
    >
      <Play className="h-4 w-4 mr-2" />
      {label}
    </Button>
  );
};
