"use client";
import { destroy } from "@/actions/unit";
import { Button } from "@/components/ui/button";
import { useAlertDialog } from "@/stores/use-alert-dialog";
import { Unit } from "@prisma/client";
import { Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

interface UnitDeleteButtonProps {
  data: Unit;
  label: string;
}
export const UnitDeleteButton = ({ data, label }: UnitDeleteButtonProps) => {
  const { id } = data;
  const { onOpen, onClose, setPending } = useAlertDialog();

  const t = useTranslations("units");
  const onConfirm = async () => {
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
        toast.error(t("status.failure.destroy"));
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
          title: t("form.destroy.title"),
          description: t("form.destroy.description"),
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
