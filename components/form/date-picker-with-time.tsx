"use client";

import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { setHours, setMinutes } from "date-fns";

import { cn, getHourAndMinute } from "@/lib/utils";
import { Matcher } from "react-day-picker";
import { Input } from "../ui/input";
import { ChangeEventHandler, useState } from "react";
import { useFormatter } from "next-intl";

interface DatePickerWithTimeProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  disabled?: boolean;
  disabledDateRange?: Matcher | Matcher[];
  placeholder?: string;
  defaultTime?: string;
}
export const DatePickerWithTime = ({
  value: date,
  disabled,
  onChange,
  placeholder,
  disabledDateRange,
  defaultTime = "07:00",
}: DatePickerWithTimeProps) => {
  const { dateTime } = useFormatter();
  const [timeValue, setTimeValue] = useState<string>(() =>
    getHourAndMinute(date, defaultTime)
  );
  const handleTimeChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const time = e.target.value;
    if (!date) {
      setTimeValue(time);
      return;
    }
    const [hours, minutes] = time.split(":").map((str) => parseInt(str, 10));
    const newSelectedDate = setHours(setMinutes(date, minutes), hours);
    onChange(newSelectedDate);
    setTimeValue(time);
  };

  const handleDaySelect = (date: Date | undefined) => {
    if (!timeValue || !date) {
      onChange(date);
      return;
    }
    const [hours, minutes] = timeValue
      .split(":")
      .map((str) => parseInt(str, 10));
    const newDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      hours,
      minutes
    );
    onChange(newDate);
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            dateTime(date, {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour12: true,
              hour: "2-digit",
              minute: "2-digit",
            })
          ) : (
            <span>{placeholder || "Pick a date"}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-full flex-col space-y-2 p-2">
        <div className="rounded-md border p-2">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDaySelect}
            disabled={disabledDateRange}
          />
          <div className="flex gap-x-2 items-center justify-center">
            Select time:{" "}
            <Input
              type="time"
              className="w-fit"
              value={timeValue}
              onChange={handleTimeChange}
            />{" "}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
