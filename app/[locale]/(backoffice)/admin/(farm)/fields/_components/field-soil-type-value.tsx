"use client";

import { Badge } from "@/components/ui/badge";
import { SoilType } from "@prisma/client";
import { useTranslations } from "next-intl";

interface FieldSoilTypeValue {
  value: SoilType;
}
export const FieldSoilTypeValue = ({ value }: FieldSoilTypeValue) => {
  const t = useTranslations(`fields.schema.soilType`);
  if (value === "ALLUVIUM") {
    return <Badge variant={"info"}>{t(`options.${value}`)}</Badge>;
  }
  if (value === "CLAY") {
    return <Badge variant={"cyanToBlue"}>{t(`options.${value}`)}</Badge>;
  }
  if (value === "LOAM") {
    return <Badge variant={"edit"}>{t(`options.${value}`)}</Badge>;
  }
  if (value === "SAND") {
    return <Badge variant={"success"}>{t(`options.${value}`)}</Badge>;
  }
};
