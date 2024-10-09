import { useState } from "react";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "../form/date-picker-with-range";
import { format } from "date-fns";
import { useUpdateSearchParams } from "@/hooks/use-update-search-param";
import { cn, dateToString, parseToDate } from "@/lib/utils";

interface DatePickerWithRangeButtonProps {
  className?: string;
  placeholder?: string;
  begin?: Date | undefined;
  end?: Date | undefined;
}
export const DatePickerWithRangeButton = ({
  className,
  placeholder,
  begin,
  end,
}: DatePickerWithRangeButtonProps) => {
  const { updateSearchParams, initialParams } = useUpdateSearchParams({
    begin: dateToString(begin),
    end: dateToString(end),
  });

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: parseToDate(initialParams.begin),
    to: parseToDate(initialParams.end),
  });

  const handelChangeDate = (date: DateRange | undefined) => {
    if (!date) {
      setDateRange(undefined);
      updateSearchParams({
        begin: undefined,
        end: undefined,
      });
    } else {
      setDateRange(date);
      updateSearchParams({
        begin: dateToString(date.from),
        end: dateToString(date.to),
      });
    }
  };
  return (
    <DatePickerWithRange
      date={dateRange}
      handleChange={handelChangeDate}
      className={cn("my-2 lg:w-[250px] w-full", className)}
      placeholder={placeholder}
    />
  );
};
