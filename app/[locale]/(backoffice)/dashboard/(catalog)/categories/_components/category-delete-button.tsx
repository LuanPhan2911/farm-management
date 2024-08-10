"use client";
import { destroy } from "@/actions/category";
import { Button } from "@/components/ui/button";
import { useAlertDialog } from "@/stores/use-alert-dialog";
import { Category } from "@prisma/client";
import { Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

interface CategoryDeleteButtonProps {
  data: Category;
  label: string;
}
export const CategoryDeleteButton = ({
  data,
  label,
}: CategoryDeleteButtonProps) => {
  const { id } = data;
  const { onOpen, onClose } = useAlertDialog();
  const tDestroy = useTranslations("categories.form.destroy");
  const onConfirm = async () => {
    destroy(id)
      .then(({ message }) => {
        toast.success(message);
      })
      .catch((error: Error) => {
        toast.error(error.message);
      })
      .finally(() => {
        onClose();
      });
  };
  return (
    <Button
      className="w-full"
      onClick={() =>
        onOpen({
          title: tDestroy("title"),
          description: tDestroy("description"),
          onConfirm,
        })
      }
    >
      <Trash className="h-6 w-6 mr-2" />
      {label}
    </Button>
  );
};
