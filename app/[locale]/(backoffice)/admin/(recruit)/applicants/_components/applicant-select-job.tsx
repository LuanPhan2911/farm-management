"use client";

import { ComboBox, ComboBoxData } from "@/components/combobox";
import { usePathname, useRouter } from "@/navigation";
import { useSearchParams } from "next/navigation";

interface ApplicantSelectJobProps {
  data: {
    id: string;
    name: string;
  }[];
}
export const ApplicantSelectJob = ({ data }: ApplicantSelectJobProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

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
      labelNotfound="Jobs not found"
      labelSearch="Search job..."
      labelSelect="Select job..."
      onChange={handleChange}
    />
  );
};
