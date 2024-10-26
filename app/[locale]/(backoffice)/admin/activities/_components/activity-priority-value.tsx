"use client";

import { Badge } from "@/components/ui/badge";
import { ActivityPriority } from "@prisma/client";
import { useTranslations } from "next-intl";

interface ActivityPriorityValueProps {
  value: ActivityPriority;
}
export const ActivityPriorityValue = ({
  value,
}: ActivityPriorityValueProps) => {
  const t = useTranslations(`activities.schema.priority`);
  if (value === "LOW") {
    return <Badge variant={"info"}>{t(`options.${value}`)}</Badge>;
  }
  if (value === "MEDIUM") {
    return <Badge variant={"cyanToBlue"}>{t(`options.${value}`)}</Badge>;
  }
  if (value === "HIGH") {
    return <Badge variant={"edit"}>{t(`options.${value}`)}</Badge>;
  }
  if (value === "URGENT") {
    return <Badge variant={"destructive"}>{t(`options.${value}`)}</Badge>;
  }
};
