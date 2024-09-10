"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlantTable } from "@/types";
import { useTranslations } from "next-intl";
import { PlantEditForm } from "./plant-edit-button";

interface PlantInfoProps {
  data: PlantTable;
}
export const PlantInfo = ({ data }: PlantInfoProps) => {
  const t = useTranslations("plants");
  return (
    <Card className="grid grid-cols-1 lg:grid-cols-5 p-6">
      <CardHeader>
        <CardTitle>{t("tabs.info.title")}</CardTitle>
        <CardDescription>{t("tabs.info.description")}</CardDescription>
        <h3 className="text-lg font-semibold">{data.name}</h3>
      </CardHeader>
      <CardContent className="lg:col-span-4">
        <PlantEditForm data={data} />
      </CardContent>
    </Card>
  );
};
