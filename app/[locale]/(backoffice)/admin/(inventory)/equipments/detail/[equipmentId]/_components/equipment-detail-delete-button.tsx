"use client";
import { destroy } from "@/actions/equipment-detail";
import { Button } from "@/components/ui/button";
import { useAlertDialog } from "@/stores/use-alert-dialog";
import { EquipmentDetail } from "@prisma/client";
import { Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

interface EquipmentDetailDeleteButtonProps {
  data: EquipmentDetail;
  label: string;
}
export const EquipmentDetailDeleteButton = ({
  data,
  label,
}: EquipmentDetailDeleteButtonProps) => {
  const { id } = data;
  const { onOpen, onClose, setPending } = useAlertDialog();

  const t = useTranslations("equipmentDetails.form");
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
