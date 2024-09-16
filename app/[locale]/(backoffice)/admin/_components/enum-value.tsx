"use client";

import { useTranslations } from "next-intl";

interface EnumValueProps {
  value: string;
  key: string;
}
export const EnumValue = ({ value, key }: EnumValueProps) => {
  const t = useTranslations(`${key}.`);
  return t(value);
};
