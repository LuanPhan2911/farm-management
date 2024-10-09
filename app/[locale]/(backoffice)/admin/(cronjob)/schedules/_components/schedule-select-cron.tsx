"use client";

import { SelectData, SelectOptions } from "@/components/form/select-options";

interface ScheduleSelectCronProps {
  defaultValue?: string | null;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
}
export const ScheduleSelectCron = ({
  defaultValue,
  onChange,
  placeholder,
  disabled,
}: ScheduleSelectCronProps) => {
  const options: SelectData[] = [
    { label: "Every minute", value: "* * * * *" },
    { label: "Every 5 minutes", value: "*/5 * * * *" },
    { label: "Every 15 minutes", value: "*/15 * * * *" },
    { label: "Every 30 minutes", value: "*/30 * * * *" },
    { label: "Every hour", value: "0 * * * *" },
    { label: "Every day at midnight", value: "0 0 * * *" },
    { label: "Every day at noon", value: "0 12 * * *" },
    { label: "Every Monday at 9 AM", value: "0 9 * * 1" },
    { label: "Every Friday at 6 PM", value: "0 18 * * 5" },
    { label: "Every month on the 1st at midnight", value: "0 0 1 * *" },
    { label: "Every month on the 15th at noon", value: "0 12 15 * *" },
    { label: "Every year on January 1st at midnight", value: "0 0 1 1 *" },
    { label: "Every year on July 4th at noon", value: "0 12 4 7 *" },
    { label: "Every weekday at 9 AM", value: "0 9 * * 1-5" },
  ];
  return (
    <SelectOptions
      label={placeholder}
      onChange={onChange}
      defaultValue={defaultValue}
      options={options}
      disabled={disabled}
    />
  );
};
