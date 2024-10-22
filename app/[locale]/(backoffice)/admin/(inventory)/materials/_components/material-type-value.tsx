"use client";

import { Badge } from "@/components/ui/badge";
import { MaterialType } from "@prisma/client";

import { useTranslations } from "next-intl";

interface MaterialTypeValueProps {
  value: MaterialType;
}
export const MaterialTypeValue = ({ value }: MaterialTypeValueProps) => {
  const t = useTranslations(`materials.schema.type`);
  if (value === "FERTILIZER") {
    return <Badge variant={"info"}>{t(`options.${value}`)}</Badge>;
  }
  if (value === "PESTICIDE") {
    return <Badge variant={"cyanToBlue"}>{t(`options.${value}`)}</Badge>;
  }
  if (value === "SEED") {
    return <Badge variant={"edit"}>{t(`options.${value}`)}</Badge>;
  }
  if (value === "OTHER") {
    return <Badge variant={"destructive"}>{t(`options.${value}`)}</Badge>;
  }
};
