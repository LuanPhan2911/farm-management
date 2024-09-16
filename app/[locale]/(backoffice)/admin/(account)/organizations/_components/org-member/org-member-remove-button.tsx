"use client";

import { destroyMember } from "@/actions/organization";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/navigation";
import { useAlertDialog } from "@/stores/use-alert-dialog";
import { OrganizationMembershipPublicUserData } from "@clerk/nextjs/server";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

interface OrgMemberRemoveButtonProps {
  data: OrganizationMembershipPublicUserData;
  label: string;
}

export const OrgMemberRemoveButton = ({
  data,
  label,
}: OrgMemberRemoveButtonProps) => {
  const { onOpen, onClose } = useAlertDialog();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("organizations");
  const params = useParams<{
    orgId: string;
  }>();

  const onConfirm = async () => {
    startTransition(() => {
      destroyMember(data.userId, params.orgId)
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
    });
  };
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onOpen({
      title: t("form.destroyMember.title"),
      description: t("form.destroyMember.description"),
      onConfirm,
      isPending,
    });
  };
  return (
    <Button
      variant={"destroy"}
      size={"sm"}
      className="w-full"
      onClick={handleClick}
    >
      {label}
    </Button>
  );
};
