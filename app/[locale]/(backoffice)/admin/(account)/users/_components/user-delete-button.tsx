"use client";
import { destroy } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/navigation";
import { useAlertDialog } from "@/stores/use-alert-dialog";
import { useVerification } from "@/stores/use-verification";
import { useSignUp } from "@clerk/nextjs";

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
  const tDestroy = useTranslations("users.form.destroy");
  const tForm = useTranslations("form");
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
        toast.error(tForm("error"));
      })
      .finally(() => {
        onClose();
      });
  };
  const handleClick = () => {
    onOpen({
      title: tDestroy("title"),
      description: tDestroy("description"),
      onConfirm,
    });
  };

  return (
    <Button
      variant={"destructive"}
      className="w-full"
      onClick={handleClick}
      size={"sm"}
    >
      <Trash className="h-6 w-6 mr-2" />
      {label}
    </Button>
  );
};
