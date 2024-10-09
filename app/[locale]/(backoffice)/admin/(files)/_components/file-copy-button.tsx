"use client";

import { copy } from "@/actions/file";
import { Button } from "@/components/ui/button";
import { useAlertDialog } from "@/stores/use-alert-dialog";
import { FileWithOwner } from "@/types";
import { Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

interface FileCopyButtonProps {
  data: FileWithOwner;
  label: string;
  disabled?: boolean;
}
export const FileCopyButton = ({
  data,
  label,
  disabled,
}: FileCopyButtonProps) => {
  const { onOpen, onClose, setPending } = useAlertDialog();

  const t = useTranslations("files.form");
  const onConfirm = async () => {
    setPending(true);
    copy(data)
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
          title: t("copy.title"),
          description: t("copy.description"),
          onConfirm,
        });
      }}
      size={"sm"}
      variant={"outline"}
      disabled={disabled}
    >
      <Copy className="h-4 w-4 mr-2" />
      {label}
    </Button>
  );
};
