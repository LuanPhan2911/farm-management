"use client";

import { destroyMember } from "@/actions/organization";
import { Button } from "@/components/ui/button";
import { useAlertDialog } from "@/stores/use-alert-dialog";
import { OrganizationMembershipPublicUserData } from "@clerk/nextjs/server";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { toast } from "sonner";

interface OrgMemberRemoveButtonProps {
  data: OrganizationMembershipPublicUserData;
  label: string;
}

export const OrgMemberRemoveButton = ({
  data,
  label,
}: OrgMemberRemoveButtonProps) => {
  const { onOpen, onClose, setPending } = useAlertDialog();

  const t = useTranslations("organizations");
  const params = useParams<{
    orgId: string;
  }>();

  const onConfirm = async () => {
    setPending(true);

    destroyMember(data.userId, params!.orgId)
      .then(({ message, ok }) => {
        if (ok) {
          onClose();
          toast.success(message);
        } else {
          toast.error(message);
        }
      })
      .catch((error) => {
        toast.error(t("status.failure.destroyMember"));
      })
      .finally(() => {
        onClose();
      });
  };

  return (
    <Button
      variant={"destroy"}
      size={"sm"}
      className="w-full"
      onClick={(e) => {
        e.stopPropagation();
        onOpen({
          title: t("form.destroyMember.title"),
          description: t("form.destroyMember.description"),
          onConfirm,
        });
      }}
    >
      {label}
    </Button>
  );
};
