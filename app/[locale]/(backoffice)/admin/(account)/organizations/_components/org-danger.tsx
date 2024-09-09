import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OrgDeleteButton } from "./org-delete-button";
import { useTranslations } from "next-intl";

export const OrgDanger = () => {
  const t = useTranslations("organizations.form");
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("destroy.title")}</CardTitle>
        <CardDescription>{t("destroy.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <OrgDeleteButton />
      </CardContent>
    </Card>
  );
};
