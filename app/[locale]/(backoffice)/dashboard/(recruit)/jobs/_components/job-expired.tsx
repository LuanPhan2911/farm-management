"use client";

import { Badge } from "@/components/ui/badge";
import { useFormatter, useNow } from "next-intl";
import { isFuture } from "date-fns";

interface JobExpiredProps {
  expiredAt: Date;
}
export const JobExpired = ({ expiredAt }: JobExpiredProps) => {
  const format = useFormatter();
  const now = useNow();

  const isValidDate = isFuture(expiredAt);
  return (
    <div className="flex flex-col gap-y-2 justify-center items-center">
      <div>
        {format.dateTime(expiredAt, {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })}
      </div>
      <Badge variant={isValidDate ? "success" : "destructive"}>
        {isValidDate ? "active" : "expired"}
      </Badge>
    </div>
  );
};
