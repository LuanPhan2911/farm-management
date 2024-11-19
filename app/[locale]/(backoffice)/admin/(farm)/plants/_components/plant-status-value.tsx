"use client";

import { Badge } from "@/components/ui/badge";
import { Season } from "@prisma/client";
import { useTranslations } from "next-intl";

interface PlantSeasonValueProps {
  value?: Season;
}
export const PlantSeasonValue = ({ value }: PlantSeasonValueProps) => {
  const t = useTranslations(`plants.schema.season`);
  if (value === "SPRING") {
    return <Badge variant={"info"}>{t(`options.${value}`)}</Badge>;
  }
  if (value === "SUMMER") {
    return <Badge variant={"cyanToBlue"}>{t(`options.${value}`)}</Badge>;
  }
  if (value === "AUTUMN") {
    return <Badge variant={"edit"}>{t(`options.${value}`)}</Badge>;
  }
  if (value === "WINTER") {
    return <Badge variant={"outline"}>{t(`options.${value}`)}</Badge>;
  }
  return <Badge variant={"success"}>Any season</Badge>;
};
