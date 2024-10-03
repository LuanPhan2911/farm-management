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
  const t = useTranslations("organizations.tabs");
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("danger.title")}</CardTitle>
        <CardDescription>{t("danger.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <OrgDeleteButton />
      </CardContent>
    </Card>
  );
};
