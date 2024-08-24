"use client";

import { ComboBox, ComboBoxData } from "@/components/combobox";
import { usePathname, useRouter } from "@/navigation";
import { JobSelect } from "@/types";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

interface ApplicantSelectJobProps {
  data: JobSelect[];
}
export const ApplicantSelectJob = ({ data }: ApplicantSelectJobProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("applicants.search");

  if (!data.length) {
    return null;
  }
  const options: ComboBoxData[] = data.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });

  options.unshift({
    label: "All",
    value: "ALL",
  });
  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "ALL") {
      params.delete("filter");
    } else {
      params.set("filter", value);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };
  return (
    <ComboBox
      data={options}
      notFound={t("comboBox.notFound")}
      label={t("comboBox.label")}
      onChange={handleChange}
      defaultValue={"ALL"}
    />
  );
};
