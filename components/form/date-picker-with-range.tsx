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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  eachMonthOfInterval,
  endOfMonth,
  format,
  startOfMonth,
  startOfYear,
} from "date-fns";
interface DatePickerWithRangeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  date: DateRange | undefined;
  handleChange: (date: DateRange | undefined) => void;
  disabled?: boolean;
  disabledDateRange?: Matcher | Matcher[];
  placeholder?: string;
}
export function DatePickerWithRange({
  className,
  date,
  disabled,
  disabledDateRange,
  handleChange,
  placeholder,
}: DatePickerWithRangeProps) {
  const { dateTime } = useFormatter();

  const eachMonths = eachMonthOfInterval({
    start: startOfYear(new Date()),
    end: new Date(),
  });
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
            disabled={disabled}
            size={"sm"}
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
              <span>{placeholder || "Pick a date"}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Select
            onValueChange={(value) => {
              handleChange({
                from: new Date(value),
                to: endOfMonth(value),
              });
            }}
            value={
              date?.from ? startOfMonth(date.from).toISOString() : undefined
            }
          >
            <SelectTrigger>
              <SelectValue placeholder={placeholder || "Select"} />
            </SelectTrigger>
            <SelectContent position="popper">
              {eachMonths.map((item) => {
                return (
                  <SelectItem
                    value={item.toISOString()}
                    key={item.toISOString()}
                  >
                    <span className="font-semibold text-green-500">
                      {dateTime(item, { month: "long" })}
                    </span>
                    {` (${dateTime(item)} - ${dateTime(endOfMonth(item))})`}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

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
