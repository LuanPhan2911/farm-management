"use client";

import { Badge } from "@/components/ui/badge";
import { useFormatter } from "next-intl";
import { addDays, isFuture } from "date-fns";

interface JobExpiredProps {
  expiredAt: Date;
}
export const JobExpired = ({ expiredAt }: JobExpiredProps) => {
  const format = useFormatter();
  const isValidDate = isFuture(addDays(expiredAt, 1));
  return (
    <div className="flex flex-col gap-y-2 justify-center items-center">
      <p>
        {format.dateTime(expiredAt, {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })}
      </p>
      <Badge variant={isValidDate ? "success" : "destructive"}>
        {isValidDate ? "active" : "expired"}
      </Badge>
    </div>
  );
};
