"use client";

import { Badge } from "@/components/ui/badge";

import { isFuture } from "date-fns";

interface JobExpiredProps {
  expiredAt: Date;
}
export const JobExpired = ({ expiredAt }: JobExpiredProps) => {
  const isValidDate = isFuture(expiredAt);
  return (
    <Badge variant={isValidDate ? "success" : "destructive"}>
      {isValidDate ? "active" : "expired"}
    </Badge>
  );
};
