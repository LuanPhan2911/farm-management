"use client";

import { Badge } from "@/components/ui/badge";

import { isFuture } from "date-fns";

interface JobExpiredValueProps {
  expiredAt: Date;
}
export const JobExpiredValue = ({ expiredAt }: JobExpiredValueProps) => {
  const isValidDate = isFuture(expiredAt);
  return (
    <Badge variant={isValidDate ? "success" : "destructive"}>
      {isValidDate ? "active" : "expired"}
    </Badge>
  );
};
