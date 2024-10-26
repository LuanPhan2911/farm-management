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
  const { onOpen, onClose, setPending } = useAlertDialog();

  const t = useTranslations("organizations.form");
  const router = useRouter();
  const params = useParams<{
    orgId: string;
  }>();
  const onConfirm = () => {
    setPending(true);
    destroy(params!.orgId)
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
        toast.error("Internal error");
      })
      .finally(() => {
        onClose();
      });
  };

  return (
    <Button
      variant={"destroy"}
      size={"sm"}
      onClick={(e) => {
        e.stopPropagation();
        onOpen({
          title: t("destroy.title"),
          description: t("destroy.description"),
          onConfirm,
        });
      }}
    >
      <Trash className="mr-2" /> {t("destroy.label")}
    </Button>
  );
};
