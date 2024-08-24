import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserAvatar } from "@/components/user-avatar";
import {
  getOrganizationById,
  getOrganizationMembership,
} from "@/services/organizations";
import { notFound } from "next/navigation";
import { OrgProfile } from "../../_components/org-profile";
import { OrgMember } from "../../_components/org-member";
import { OrgDanger } from "../../_components/org-danger";
import { getStaffsForAddMemberOrganization } from "@/services/staffs";
import { getTranslations } from "next-intl/server";

interface OrganizationDetailPageProps {
  params: {
    orgId: string;
  };
}

const OrganizationDetailPage = async ({
  params,
}: OrganizationDetailPageProps) => {
  const org = await getOrganizationById(params.orgId);
  const t = await getTranslations("organizations.tabs");
  const { data: organizationMemberShip, totalPage } =
    await getOrganizationMembership(params.orgId, "", 1);
  const orgMembers = await getStaffsForAddMemberOrganization(params.orgId);
  if (!org) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-y-4 h-full py-4">
      <UserAvatar src={org.imageUrl} size={"lg"} />
      <h3 className="text-lg font-semibold">{org.name}</h3>
      <Tabs defaultValue="profile">
        <TabsList className="grid w-[500px] grid-cols-3">
          <TabsTrigger value="profile">{t("profile.title")}</TabsTrigger>
          <TabsTrigger value="member">{t("member.title")}</TabsTrigger>
          <TabsTrigger value="danger">{t("danger.title")}</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <OrgProfile data={structuredClone(org)} />
        </TabsContent>
        <TabsContent value="member">
          <OrgMember
            data={structuredClone(organizationMemberShip)}
            totalPage={totalPage}
            orgMembers={orgMembers}
          />
        </TabsContent>
        <TabsContent value="danger">
          <OrgDanger />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrganizationDetailPage;
