"use client";

import { Badge } from "@/components/ui/badge";
import { ActivityStatus } from "@prisma/client";
import { useTranslations } from "next-intl";

interface ActivityStatusValueProps {
  value: ActivityStatus;
}
export const ActivityStatusValue = ({ value }: ActivityStatusValueProps) => {
  const t = useTranslations(`activities.schema.status`);
  if (value === "NEW") {
    return <Badge variant={"info"}>{t(`options.${value}`)}</Badge>;
  }
  if (value === "PENDING") {
    return <Badge variant={"cyanToBlue"}>{t(`options.${value}`)}</Badge>;
  }
  if (value === "IN_PROGRESS") {
    return <Badge variant={"edit"}>{t(`options.${value}`)}</Badge>;
  }
  if (value === "COMPLETED") {
    return <Badge variant={"success"}>{t(`options.${value}`)}</Badge>;
  }
};
