import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OrganizationMembershipPublicUserData } from "@clerk/nextjs/server";
import { Ellipsis } from "lucide-react";
import { OrgMemberViewProfileButton } from "./org-member-view-profile-button";
import { OrgMemberRemoveButton } from "./org-member-remove-button";
import { useTranslations } from "next-intl";
interface OrgMemberActionProps {
  data: OrganizationMembershipPublicUserData | null | undefined;
}
export const OrgMemberAction = ({ data }: OrgMemberActionProps) => {
  const t = useTranslations("organizations.form");
  if (!data) {
    return null;
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis className="h-6 w-6" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <OrgMemberViewProfileButton
            data={data}
            label={t("viewProfile.label")}
          />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <OrgMemberRemoveButton data={data} label={t("destroyMember.label")} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
