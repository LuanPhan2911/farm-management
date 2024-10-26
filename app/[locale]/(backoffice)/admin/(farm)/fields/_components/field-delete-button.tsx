"use client";

import { destroy } from "@/actions/field";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/navigation";
import { useAlertDialog } from "@/stores/use-alert-dialog";
import { Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export const FieldDeleteButton = () => {
  const { onOpen, onClose, setPending } = useAlertDialog();
  const t = useTranslations("fields.form");

  const router = useRouter();
  const params = useParams<{
    fieldId: string;
  }>();
  const onConfirm = async () => {
    setPending(true);
    destroy(params!.fieldId)
      .then(({ message, ok }) => {
        if (ok) {
          onClose();
          toast.success(message);
          router.replace("/admin/fields");
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
    e.preventDefault();
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
