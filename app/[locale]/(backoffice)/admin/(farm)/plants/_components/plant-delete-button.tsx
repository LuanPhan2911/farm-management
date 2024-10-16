"use client";

import { destroy } from "@/actions/plant";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/navigation";
import { useAlertDialog } from "@/stores/use-alert-dialog";
import { Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { toast } from "sonner";
export const PlantDeleteButton = () => {
  const { onOpen, onClose, setPending } = useAlertDialog();

  const t = useTranslations("plants.form");
  const router = useRouter();
  const params = useParams<{
    plantId: string;
  }>();
  const onConfirm = async () => {
    setPending(true);
    destroy(params!.plantId)
      .then(({ message, ok }) => {
        if (ok) {
          onClose();
          toast.success(message);
          router.replace("/admin/plants");
        } else {
          toast.error(message);
        }
      })
      .catch((error) => {
        toast.error("Internal error");
      })
      .finally(() => {
        onClose();
      });
  };
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpen({
      title: t("destroy.title"),
      description: t("destroy.description"),
      onConfirm,
    });
  };
  return (
    <Button variant={"destroy"} size={"sm"} onClick={handleClick}>
      <Trash className="mr-2" /> {t("destroy.label")}
    </Button>
  );
};
