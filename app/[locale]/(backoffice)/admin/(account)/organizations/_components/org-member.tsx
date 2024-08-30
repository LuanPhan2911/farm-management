"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { OrganizationMembership } from "@clerk/nextjs/server";
import { useTranslations } from "next-intl";

import { useSearchParams } from "next/navigation";
import { OrgMemberTable } from "./org-member-table";
interface OrgMemberProps {
  data: OrganizationMembership[];
  totalPage: number;
}
export const OrgMember = ({ data, totalPage }: OrgMemberProps) => {
  const t = useTranslations("organizations");
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  if (query) {
    data = data.filter((item) =>
      item.publicUserData?.identifier.includes(query)
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("tabs.member.title")}</CardTitle>
        <CardDescription>{t("tabs.member.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <OrgMemberTable data={data} totalPage={totalPage} />
      </CardContent>
    </Card>
  );
};
