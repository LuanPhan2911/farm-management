"use client";

import { Badge } from "@/components/ui/badge";
import { PesticideType, ToxicityLevel } from "@prisma/client";
import { useTranslations } from "next-intl";

interface PesticideTypeValueProps {
  value?: PesticideType;
}
export const PesticideTypeValue = ({ value }: PesticideTypeValueProps) => {
  const t = useTranslations(`pesticides.schema.type`);
  if (value === "FUNGICIDE") {
    return <Badge variant={"info"}>{t(`options.${value}`)}</Badge>;
  }
  if (value === "HERBICIDE") {
    return <Badge variant={"cyanToBlue"}>{t(`options.${value}`)}</Badge>;
  }
  if (value === "PESTICIDE") {
    return <Badge variant={"edit"}>{t(`options.${value}`)}</Badge>;
  }
  return <Badge variant={"destructive"}>Null</Badge>;
};

interface PesticideToxicLevelValueProps {
  value?: ToxicityLevel;
}
export const PesticideToxicLevelValue = ({
  value,
}: PesticideToxicLevelValueProps) => {
  const t = useTranslations(`pesticides.schema.toxicityLevel`);
  if (value === "HIGH") {
    return <Badge variant={"info"}>{t(`options.${value}`)}</Badge>;
  }
  if (value === "LOW") {
    return <Badge variant={"cyanToBlue"}>{t(`options.${value}`)}</Badge>;
  }
  if (value === "MID") {
    return <Badge variant={"edit"}>{t(`options.${value}`)}</Badge>;
  }
  return <Badge variant={"destructive"}>Null</Badge>;
};
