"use client";

import { destroy } from "@/actions/staff";
import { Button } from "@/components/ui/button";
import { useRole } from "@/hooks/use-role";
import { useRouter } from "@/navigation";
import { useAlertDialog } from "@/stores/use-alert-dialog";

import { User } from "@clerk/nextjs/server";
import { StaffRole } from "@prisma/client";

import { Trash } from "lucide-react";
import { useTranslations } from "next-intl";

import { toast } from "sonner";

interface StaffDeleteButtonProps {
  data: User;
  label: string;
}
export const StaffDeleteButton = ({ data, label }: StaffDeleteButtonProps) => {
  const { id } = data;
  const { onOpen, onClose, setPending } = useAlertDialog();

  const t = useTranslations("staffs");
  const { isSuperAdmin } = useRole(data.publicMetadata.role as StaffRole);

  const router = useRouter();

  const onConfirm = async () => {
    setPending(true);
    destroy(id)
      .then(({ message, ok }) => {
        if (ok) {
          onClose();
          toast.success(message);
          router.push("/admin/staffs");
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

  return (
    <Button
      variant={"destroy"}
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
      disabled={isSuperAdmin}
    >
      <Trash className="h-4 w-4 mr-2" />
      {label}
    </Button>
  );
};
