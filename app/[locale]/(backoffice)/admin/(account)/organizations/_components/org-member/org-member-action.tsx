import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OrganizationMembership } from "@clerk/nextjs/server";
import { Ellipsis, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { LinkButton } from "@/components/buttons/link-button";
import { ActionButton } from "@/components/buttons/action-button";
import { destroyMember } from "@/actions/organization";
import { useContext } from "react";
import { OrgContext } from "../org-tabs";
interface OrgMemberActionProps {
  data: OrganizationMembership;
}
export const OrgMemberAction = ({ data }: OrgMemberActionProps) => {
  const t = useTranslations("organizations.form");
  const { canManageMember, isCreated, isSelf } = useContext(OrgContext);
  if (!data.publicUserData) {
    return null;
  }
  const disabled =
    !canManageMember ||
    isSelf(data.publicUserData.userId) ||
    isCreated(data.publicUserData.userId);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <LinkButton
            href={`staffs/detail/${data.publicUserData.userId}`}
            label={t("viewProfile.label")}
            className="w-full"
          />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ActionButton
            actionFn={() =>
              destroyMember(data.publicUserData!.userId, data.organization.id)
            }
            label={t("destroyMember.label")}
            description={t("destroyMember.description")}
            title={t("destroyMember.title")}
            className="w-full"
            disabled={disabled}
            icon={Trash}
            variant={"destroy"}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
