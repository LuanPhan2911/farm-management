"use client";

import { Badge } from "@/components/ui/badge";
import { EquipmentStatus } from "@prisma/client";
import { useTranslations } from "next-intl";

interface EquipmentDetailStatusValueProps {
  status: EquipmentStatus;
}

export const EquipmentDetailStatusValue = ({
  status,
}: EquipmentDetailStatusValueProps) => {
  const t = useTranslations(`equipmentDetails.schema.status`);
  if (status === "AVAILABLE") {
    return <Badge variant={"success"}>{t(`options.${status}`)}</Badge>;
  }
  if (status === "DECOMMISSION") {
    return <Badge variant={"destructive"}>{t(`options.${status}`)}</Badge>;
  }
  if (status === "MAINTENANCE") {
    return <Badge variant={"edit"}>{t(`options.${status}`)}</Badge>;
  }
  if (status === "WORKING") {
    return <Badge variant={"info"}>{t(`options.${status}`)}</Badge>;
  }
};
