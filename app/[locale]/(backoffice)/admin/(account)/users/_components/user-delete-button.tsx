"use client";
import { destroy } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/navigation";
import { useAlertDialog } from "@/stores/use-alert-dialog";

import { User } from "@clerk/nextjs/server";

import { Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

interface UserDeleteButtonProps {
  data: User;
  label: string;
}
export const UserDeleteButton = ({ data, label }: UserDeleteButtonProps) => {
  const { id } = data;
  const { onOpen, onClose } = useAlertDialog();
  const t = useTranslations("users");

  const router = useRouter();

  const onConfirm = async () => {
    destroy(id)
      .then(({ message, ok }) => {
        if (ok) {
          onClose();
          toast.success(message);
          router.push("/admin/users");
        } else {
          toast.error(message);
        }
      })
      .catch((error) => {
        toast.error(t("status.failure.destroy"));
      })
      .finally(() => {
        onClose();
      });
  };
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onOpen({
      title: t("form.destroy.title"),
      description: t("form.destroy.description"),
      onConfirm,
    });
  };

  return (
    <Button
      variant={"destroy"}
      className="w-full"
      onClick={handleClick}
      size={"sm"}
    >
      <Trash className="h-6 w-6 mr-2" />
      {label}
    </Button>
  );
};
