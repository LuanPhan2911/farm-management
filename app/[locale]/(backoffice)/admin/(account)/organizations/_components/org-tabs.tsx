"use client";

import { Organization, OrganizationMembership } from "@clerk/nextjs/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import { OrgMessages } from "./org-messages";
import { Staff } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserAvatar } from "@/components/user-avatar";
import { OrgEditForm } from "./org-edit-button";
import { OrgMemberTable } from "./org-member/org-member-table";
import { useSearchParams } from "next/navigation";
import { includeString } from "@/lib/utils";
import { OrgMemberCreateButton } from "./org-member/org-member-create-button";
import { createContext, useContext, useEffect } from "react";
import { OrganizationSwitcher, useAuth } from "@clerk/nextjs";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import { DestroyButton } from "@/components/buttons/destroy-button";
import { destroy } from "@/actions/organization";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/navigation";

interface OrgTabsProps {
  org: Organization;
  orgMember: OrganizationMembership[];
  currentStaff: Staff;
}

export const OrgContext = createContext<{
  canManageOrg: boolean;
  canDeleteOrg: boolean;
  canManageMember: boolean;
  isCreated: (userId: string | undefined | null) => boolean;
  isSelf: (currentUserId: string | undefined | null) => boolean;
}>({
  canManageOrg: false,
  canDeleteOrg: false,
  canManageMember: false,
  isCreated: () => false,
  isSelf: () => false,
});
export const OrgTabs = ({ org, orgMember, currentStaff }: OrgTabsProps) => {
  const t = useTranslations("organizations.tabs");
  const { has, userId, orgId } = useAuth();
  const { isSuperAdmin } = useCurrentStaffRole();
  const router = useRouter();
  const canManageOrg = has?.({ permission: "org:sys_profile:manage" }) || false;
  const canManageMember =
    has?.({ permission: "org:sys_memberships:manage" }) || false;
  const canDeleteOrg =
    has?.({ permission: "org:sys_profile:delete" }) || isSuperAdmin;

  useEffect(() => {
    if (!orgId) {
      return;
    }
    if (org.id !== orgId) {
      router.replace(`/admin/organizations/detail/${orgId}`);
    }
  }, [orgId, router, org.id]);
  return (
    <OrgContext.Provider
      value={{
        canManageOrg,
        canDeleteOrg,
        canManageMember,
        isCreated: (userIdCreated) => org.createdBy === userIdCreated,
        isSelf: (currentUserId) => userId === currentUserId,
      }}
    >
      <Tabs defaultValue="profile">
        <div className="flex justify-between">
          <TabsList className="grid grid-cols-4 lg:w-[500px] w-full">
            <TabsTrigger value="profile">{t("profile.title")}</TabsTrigger>
            <TabsTrigger value="member">{t("member.title")}</TabsTrigger>
            <TabsTrigger value="messages">{t("messages.title")}</TabsTrigger>
            <TabsTrigger value="danger">{t("danger.title")}</TabsTrigger>
          </TabsList>
          <Button className="bg-slate-300 hidden lg:inline-flex">
            <OrganizationSwitcher
              afterSelectPersonalUrl={`/admin/organizations`}
              afterLeaveOrganizationUrl={`/admin/organizations`}
              skipInvitationScreen
            />
          </Button>
        </div>

        <TabsContent value="profile">
          <OrgProfile data={org} />
        </TabsContent>
        <TabsContent value="member">
          <OrgMember data={orgMember} />
        </TabsContent>
        <TabsContent value="messages">
          <OrgMessages org={org} currentStaff={currentStaff} />
        </TabsContent>
        <TabsContent value="danger">
          <OrgDanger data={org} />
        </TabsContent>
      </Tabs>
    </OrgContext.Provider>
  );
};

interface OrgProfileProps {
  data: Organization;
}
export const OrgProfile = ({ data }: OrgProfileProps) => {
  const t = useTranslations("organizations.tabs");
  return (
    <Card className="grid lg:grid-cols-4">
      <CardHeader>
        <CardTitle>{t("profile.title")}</CardTitle>
        <CardDescription>{t("profile.description")}</CardDescription>
        <UserAvatar src={data.imageUrl} />
        <h3 className="text-lg font-semibold">{data.name}</h3>
      </CardHeader>
      <CardContent className="lg:col-span-3">
        <OrgEditForm data={data} />
      </CardContent>
    </Card>
  );
};

interface OrgMemberProps {
  data: OrganizationMembership[];
}
export const OrgMember = ({ data }: OrgMemberProps) => {
  const t = useTranslations("organizations.tabs");
  const searchParams = useSearchParams();
  const query = searchParams!.get("query");
  if (query) {
    data = data.filter((item) => {
      if (!item.publicUserData?.identifier) {
        return false;
      } else {
        return includeString(item.publicUserData?.identifier, query);
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("member.title")}</CardTitle>
        <CardDescription>{t("member.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end">
          <OrgMemberCreateButton />
        </div>
        <OrgMemberTable data={data} />
      </CardContent>
    </Card>
  );
};
interface OrgDangerProps {
  data: Organization;
}
export const OrgDanger = ({ data }: OrgDangerProps) => {
  const t = useTranslations("organizations.tabs");
  const { canDeleteOrg } = useContext(OrgContext);
  const disabled = !canDeleteOrg;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("danger.title")}</CardTitle>
        <CardDescription>{t("danger.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <DestroyButton
          destroyFn={destroy}
          id={data.id}
          inltKey="organizations"
          redirectHref="/admin/organizations"
          disabled={disabled}
        />
      </CardContent>
    </Card>
  );
};
