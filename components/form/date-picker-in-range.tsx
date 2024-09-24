"use client";
import { cn, compareDate } from "@/lib/utils";
import { HTMLAttributes } from "react";
import { DateRange, Matcher } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { useFormatter } from "next-intl";
import { Calendar } from "../ui/calendar";
import { addDays, max, min } from "date-fns";

interface DatePickerInRangeProps extends HTMLAttributes<HTMLDivElement> {
  dateRange: DateRange;
  defaultDateRange: DateRange;
  setDateRange: (date: DateRange) => void;
  inDays?: number;
  disabled?: boolean;
  disabledDateRange?: Matcher | Matcher[];
  placeholder?: string;
}
export const DatePickerInRange = ({
  dateRange,
  defaultDateRange,
  inDays = 7,
  setDateRange,
  disabled,
  disabledDateRange,
  placeholder,
  className,
}: DatePickerInRangeProps) => {
  const { dateTime } = useFormatter();
  const handleChange = (newDateRange: DateRange | undefined) => {
    if (!newDateRange || !newDateRange.from || !newDateRange.to) {
      setDateRange({
        ...defaultDateRange,
      });
      return;
    }

    if (!dateRange.from || !dateRange.to) {
      setDateRange({
        ...defaultDateRange,
      });
      return;
    }
    //  date to change
    if (compareDate(dateRange.from, newDateRange.from)) {
      setDateRange({
        to: newDateRange.to,
        from: max([addDays(newDateRange.to, -inDays), dateRange.from]),
      });
    }
    // date from change
    if (compareDate(dateRange.to, newDateRange.to)) {
      setDateRange({
        from: newDateRange.from,
        to: min([addDays(newDateRange.from, inDays), dateRange.to]),
      });
    }
  };
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}
            disabled={disabled}
            size={"sm"}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {dateTime(dateRange.from)} - {dateTime(dateRange.to)}
                </>
              ) : (
                dateTime(dateRange.from)
              )
            ) : (
              <span>{placeholder || "Pick a date"}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={handleChange}
            numberOfMonths={2}
            disabled={disabledDateRange}
          />
          <div className="flex justify-center">
            <Button
              size={"sm"}
              variant={"ghost"}
              onClick={() => handleChange(undefined)}
            >
              Clear
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
