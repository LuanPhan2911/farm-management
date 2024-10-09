"use client";

import { editDeleted } from "@/actions/file";
import { Button } from "@/components/ui/button";
import { useAlertDialog } from "@/stores/use-alert-dialog";
import { FileWithOwner } from "@/types";
import { Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

interface FileEditDeletedButtonProps {
  data: FileWithOwner;
  label: string;
  disabled?: boolean;
}
export const FileEditDeletedButton = ({
  data,
  label,
  disabled,
}: FileEditDeletedButtonProps) => {
  const { id } = data;
  const { onOpen, onClose, setPending } = useAlertDialog();

  const t = useTranslations("files.form");
  const onConfirm = async () => {
    setPending(true);
    editDeleted(id, {
      deleted: true,
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
          title: t("editDeleted.title"),
          description: t("editDeleted.description"),
          onConfirm,
        });
      }}
      size={"sm"}
      variant={"destroy"}
      disabled={disabled}
    >
      <Trash className="h-4 w-4 mr-2" />
      {label}
    </Button>
  );
};
