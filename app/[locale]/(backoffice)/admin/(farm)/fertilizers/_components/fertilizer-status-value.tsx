"use client";

import { Badge } from "@/components/ui/badge";
import { FertilizerType, Frequency } from "@prisma/client";
import { useTranslations } from "next-intl";

interface FertilizerTypeValueProps {
  value?: FertilizerType;
}
export const FertilizerTypeValue = ({ value }: FertilizerTypeValueProps) => {
  const t = useTranslations(`fertilizers.schema.type`);
  if (value === "BIO") {
    return <Badge variant={"info"}>{t(`options.${value}`)}</Badge>;
  }
  if (value === "INORGANIC") {
    return <Badge variant={"cyanToBlue"}>{t(`options.${value}`)}</Badge>;
  }
  if (value === "ORGANIC") {
    return <Badge variant={"edit"}>{t(`options.${value}`)}</Badge>;
  }
  return <Badge variant={"destructive"}>Null</Badge>;
};
interface FertilizerFrequencyValueProps {
  value?: Frequency;
}
export const FertilizerFrequencyValue = ({
  value,
}: FertilizerFrequencyValueProps) => {
  const t = useTranslations(`fertilizers.schema.frequencyOfUse`);
  if (value === "CROP") {
    return <Badge variant={"info"}>{t(`options.${value}`)}</Badge>;
  }
  if (value === "MONTHLY") {
    return <Badge variant={"cyanToBlue"}>{t(`options.${value}`)}</Badge>;
  }
  if (value === "WEEKLY") {
    return <Badge variant={"edit"}>{t(`options.${value}`)}</Badge>;
  }
  if (value === "YEARLY") {
    return <Badge variant={"success"}>{t(`options.${value}`)}</Badge>;
  }
  return <Badge variant={"destructive"}>Null</Badge>;
};
