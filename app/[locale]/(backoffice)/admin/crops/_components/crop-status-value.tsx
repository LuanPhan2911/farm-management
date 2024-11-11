"use client";

import { Badge } from "@/components/ui/badge";
import { CropStatus } from "@prisma/client";
import { useTranslations } from "next-intl";

interface CropStatusValueProps {
  value: CropStatus;
}
export const CropStatusValue = ({ value }: CropStatusValueProps) => {
  const t = useTranslations(`crops.schema.status`);
  if (value === "NEW") {
    return <Badge variant={"info"}>{t(`options.${value}`)}</Badge>;
  }
  if (value === "MEDIUM") {
    return <Badge variant={"cyanToBlue"}>{t(`options.${value}`)}</Badge>;
  }
  if (value === "MATURE") {
    return <Badge variant={"edit"}>{t(`options.${value}`)}</Badge>;
  }
  if (value === "HARVEST") {
    return <Badge variant={"destructive"}>{t(`options.${value}`)}</Badge>;
  }
  if (value === "FINISH") {
    return <Badge variant={"success"}>{t(`options.${value}`)}</Badge>;
  }
};
