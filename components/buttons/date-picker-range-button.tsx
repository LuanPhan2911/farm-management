import { useState } from "react";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "../form/date-picker-with-range";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/navigation";
import { format } from "date-fns";

interface DatePickerWithRangeButtonProps {
  from: Date | undefined;
  to?: Date | undefined;
}
export const DatePickerWithRangeButton = ({
  from,
  to,
}: DatePickerWithRangeButtonProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from,
    to,
  });
  const handelChangeDate = (date: DateRange | undefined) => {
    const params = new URLSearchParams(searchParams!);
    if (!date) {
      setDateRange(undefined);
      params!.delete("begin");
      params!.delete("end");
    } else {
      setDateRange(date);

      if (date.from) {
        params!.set("begin", `${format(date.from, "yyyy-MM-dd")}`);
      }
      if (date.to) {
        params!.set("end", `${format(date.to, "yyyy-MM-dd")}`);
      }
    }

    router.replace(`${pathname}?${params}`);
  };
  return (
    <DatePickerWithRange
      date={dateRange}
      handleChange={handelChangeDate}
      className="my-2 "
    />
  );
};
