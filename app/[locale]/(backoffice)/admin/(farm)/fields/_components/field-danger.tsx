"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldDeleteButton } from "./field-delete-button";
import { useTranslations } from "next-intl";

export const FieldDanger = () => {
  const t = useTranslations("fields.form");
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("destroy.title")}</CardTitle>
        <CardDescription>{t("destroy.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldDeleteButton />
      </CardContent>
    </Card>
  );
};
