"use client";

import { Organization, OrganizationMembership } from "@clerk/nextjs/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrgProfile } from "./org-profile";
import { OrgMember } from "./org-member";
import { OrgDanger } from "./org-danger";
import { useTranslations } from "next-intl";
import { useOrgActiveTab } from "@/stores/use-tabs";
interface OrgTabsProps {
  org: Organization;
  orgMember: OrganizationMembership[];
  totalPageOrgMember: number;
}
export const OrgTabs = ({
  org,
  orgMember,
  totalPageOrgMember,
}: OrgTabsProps) => {
  const t = useTranslations("organizations.tabs");
  const { active, setActive } = useOrgActiveTab();

  return (
    <Tabs value={active} onValueChange={setActive}>
      <TabsList className="grid w-[500px] grid-cols-3">
        <TabsTrigger value="profile">{t("profile.title")}</TabsTrigger>
        <TabsTrigger value="member">{t("member.title")}</TabsTrigger>
        <TabsTrigger value="danger">{t("danger.title")}</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <OrgProfile data={structuredClone(org)} />
      </TabsContent>
      <TabsContent value="member">
        <OrgMember data={orgMember} totalPage={totalPageOrgMember} />
      </TabsContent>
      <TabsContent value="danger">
        <OrgDanger />
      </TabsContent>
    </Tabs>
  );
};
