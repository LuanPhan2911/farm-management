"use client";

import { destroy } from "@/actions/organization";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/navigation";
import { useAlertDialog } from "@/stores/use-alert-dialog";
import { Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export const OrgDeleteButton = () => {
  const { onOpen, onClose } = useAlertDialog();
  const t = useTranslations("organizations");
  const router = useRouter();
  const params = useParams<{
    orgId: string;
  }>();
  const onConfirm = async () => {
    destroy(params.orgId)
      .then(({ message, ok }) => {
        if (ok) {
          onClose();
          toast.success(message);
          router.replace("/admin/organizations");
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
    <Button variant={"destroy"} size={"sm"} onClick={handleClick}>
      <Trash className="mr-2" /> Delete organization
    </Button>
  );
};
