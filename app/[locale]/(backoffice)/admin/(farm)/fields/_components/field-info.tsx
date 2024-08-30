"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldWithUnit } from "@/types";
import { useTranslations } from "next-intl";
import { FieldEditForm } from "./field-edit-button";

interface FieldInfoProps {
  data: FieldWithUnit;
}
export const FieldInfo = ({ data }: FieldInfoProps) => {
  const t = useTranslations("fields");
  return (
    <Card className="grid grid-cols-1 lg:grid-cols-3 p-6">
      <CardHeader>
        <CardTitle>{t("tabs.info.title")}</CardTitle>
        <CardDescription>{t("tabs.info.description")}</CardDescription>
        <h3 className="text-lg font-semibold">{data.name}</h3>
      </CardHeader>
      <CardContent className="lg:col-span-2">
        <FieldEditForm data={data} />
      </CardContent>
    </Card>
  );
};
