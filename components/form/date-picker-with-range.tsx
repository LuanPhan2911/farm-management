"use client";

import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange, Matcher } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFormatter } from "next-intl";
interface DatePickerWithRangeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  date: DateRange | undefined;
  handleChange: (date: DateRange | undefined) => void;
  disabled?: boolean;
  disabledDateRange?: Matcher | Matcher[];
}
export function DatePickerWithRange({
  className,
  date,
  disabled,
  disabledDateRange,
  handleChange,
}: DatePickerWithRangeProps) {
  const { dateTime } = useFormatter();
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {dateTime(date.from)} - {dateTime(date.to)}
                </>
              ) : (
                dateTime(date.from)
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
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
}
