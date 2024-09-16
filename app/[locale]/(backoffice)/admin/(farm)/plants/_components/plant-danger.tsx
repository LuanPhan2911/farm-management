"use client";

import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlantDeleteButton } from "./plant-delete-button";
export const PlantDanger = () => {
  const t = useTranslations("plants.form");
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("destroy.title")}</CardTitle>
        <CardDescription>{t("destroy.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <PlantDeleteButton />
      </CardContent>
    </Card>
  );
};
