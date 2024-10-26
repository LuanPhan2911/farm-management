"use client";
import { destroy } from "@/actions/task";
import { Button } from "@/components/ui/button";
import { useAlertDialog } from "@/stores/use-alert-dialog";
import { TaskResponse } from "@/types";
import { Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

interface TaskDeleteButtonProps {
  data: TaskResponse;
  label: string;
}
export const TaskDeleteButton = ({ data, label }: TaskDeleteButtonProps) => {
  const { id } = data;
  const { onOpen, onClose, setPending } = useAlertDialog();
  const t = useTranslations("tasks.form");
  const onConfirm = () => {
    setPending(true);
    destroy(id)
      .then(({ message, ok }) => {
        if (ok) {
          toast.success(message);
        } else {
          toast.error(message);
        }
      })
      .catch((error: Error) => {
        toast.error("Internal error");
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
          title: t("destroy.title"),
          description: t("destroy.description"),
          onConfirm,
        });
      }}
      size={"sm"}
      variant={"destroy"}
    >
      <Trash className="h-4 w-4 mr-2" />
      {label}
    </Button>
  );
};
