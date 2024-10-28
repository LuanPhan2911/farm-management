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
import { createContext, useContext } from "react";
import { useAuth } from "@clerk/nextjs";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import { DestroyButton } from "@/components/buttons/destroy-button";
import { destroy } from "@/actions/organization";
interface OrgTabsProps {
  org: Organization;
  orgMember: OrganizationMembership[];
  currentStaff: Staff;
}

export const OrgContext = createContext<{
  canUpdate: boolean;
  isCreated: (userId: string | undefined | null) => boolean;
  isSelf: (currentUserId: string | undefined | null) => boolean;
}>({
  canUpdate: false,
  isCreated: () => false,
  isSelf: () => false,
});
export const OrgTabs = ({ org, orgMember, currentStaff }: OrgTabsProps) => {
  const t = useTranslations("organizations.tabs");
  const { orgRole, orgId, userId } = useAuth();
  const { isSuperAdmin } = useCurrentStaffRole();
  const canUpdate =
    isSuperAdmin || (orgRole === "org:admin" && orgId === org.id);

  return (
    <OrgContext.Provider
      value={{
        canUpdate: canUpdate,
        isCreated: (userIdCreated) => org.createdBy === userIdCreated,
        isSelf: (currentUserId) => userId === currentUserId,
      }}
    >
      <Tabs defaultValue="profile">
        <TabsList className="grid grid-cols-4 lg:w-[500px] w-full">
          <TabsTrigger value="profile">{t("profile.title")}</TabsTrigger>
          <TabsTrigger value="member">{t("member.title")}</TabsTrigger>
          <TabsTrigger value="messages">{t("messages.title")}</TabsTrigger>
          <TabsTrigger value="danger">{t("danger.title")}</TabsTrigger>
        </TabsList>
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
  const { canUpdate, isCreated } = useContext(OrgContext);
  const { userId } = useAuth();
  const disabled = !canUpdate || !isCreated(userId);
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
