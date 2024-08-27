"use client";

import { destroyMember } from "@/actions/organization";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/navigation";
import { useAlertDialog } from "@/stores/use-alert-dialog";
import { OrganizationMembershipPublicUserData } from "@clerk/nextjs/server";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { toast } from "sonner";

interface OrgMemberRemoveButtonProps {
  data: OrganizationMembershipPublicUserData;
}

export const OrgMemberRemoveButton = ({ data }: OrgMemberRemoveButtonProps) => {
  const { onOpen, onClose } = useAlertDialog();
  const t = useTranslations("organizations");
  const params = useParams<{
    orgId: string;
  }>();

  const onConfirm = async () => {
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
  };
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onOpen({
      title: t("form.destroyMember.title"),
      description: t("form.destroyMember.description"),
      onConfirm,
    });
  };
  return (
    <Button
      variant={"destroy"}
      size={"sm"}
      className="w-full"
      onClick={handleClick}
    >
      Remove member
    </Button>
  );
};
