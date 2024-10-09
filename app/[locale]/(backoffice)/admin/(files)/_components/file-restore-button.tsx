"use client";

import { editDeleted } from "@/actions/file";
import { Button } from "@/components/ui/button";
import { useAlertDialog } from "@/stores/use-alert-dialog";
import { FileWithOwner } from "@/types";
import { Undo } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

interface FileRestoreButtonProps {
  data: FileWithOwner;
  label: string;
  disabled?: boolean;
}
export const FileRestoreButton = ({
  data,
  label,
  disabled,
}: FileRestoreButtonProps) => {
  const { id } = data;
  const { onOpen, onClose, setPending } = useAlertDialog();

  const t = useTranslations("files.form");
  const onConfirm = async () => {
    setPending(true);
    editDeleted(id, {
      deleted: false,
    })
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
          title: t("restore.title"),
          description: t("restore.description"),
          onConfirm,
        });
      }}
      size={"sm"}
      variant={"blue"}
      disabled={disabled}
    >
      <Undo className="h-4 w-4 mr-2" />
      {label}
    </Button>
  );
};
