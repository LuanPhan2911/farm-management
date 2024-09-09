"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Organization } from "@clerk/nextjs/server";
import { useTranslations } from "next-intl";
import { UserAvatar } from "@/components/user-avatar";
import { OrgEditForm } from "./org-edit-button";
interface OrgProfileProps {
  data: Organization;
}
export const OrgProfile = ({ data }: OrgProfileProps) => {
  const t = useTranslations("organizations");
  return (
    <Card className="grid grid-cols-1 lg:grid-cols-3">
      <CardHeader>
        <CardTitle>{t("tabs.profile.title")}</CardTitle>
        <CardDescription>{t("tabs.profile.description")}</CardDescription>
        <UserAvatar src={data.imageUrl} size={"lg"} />
        <h3 className="text-lg font-semibold">{data.name}</h3>
      </CardHeader>
      <CardContent className="lg:col-span-2">
        <OrgEditForm data={data} />
      </CardContent>
    </Card>
  );
};
