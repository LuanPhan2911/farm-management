"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useRouter } from "@/navigation";
import { JobCard } from "@/types";
import { useFormatter, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState } from "react";
interface JobCardProps {
  data: JobCard;
}
export const JobCardItem = ({ data }: JobCardProps) => {
  const params = useParams<{
    jobSlug: string;
  }>();
  const router = useRouter();
  const format = useFormatter();
  const tJob = useTranslations("jobs.schema");
  const handleClick = () => {
    router.push({
      pathname: `/jobs/${data.slug}`,
    });
  };
  return (
    <button
      className={cn(
        "flex flex-col items-start relative gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
        params?.jobSlug === data.slug && "bg-muted"
      )}
      onClick={handleClick}
    >
      <div
        className={cn(
          "text-xs absolute right-1 top-1 flex items-center gap-2",
          params.jobSlug === data.slug
            ? "text-foreground"
            : "text-muted-foreground"
        )}
      >
        <Badge variant={"info"}>
          {format.relativeTime(new Date(data.createdAt))}
        </Badge>
      </div>
      <div className="flex w-full flex-col gap-1 pt-6">
        <div className="font-semibold line-clamp-2">{data.name}</div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant={"success"}>{data.wage}</Badge>
        <Badge variant={"success"}>
          {tJob(`gender.options.${data.gender}`)}
        </Badge>
        <Badge variant={"success"}>
          {tJob(`experience.options.${data.experience}`)}
        </Badge>
        <Badge variant={"success"}>
          {tJob(`workingState.options.${data.workingState}`)}
        </Badge>
      </div>
      <div className="text-sm font-semibold">
        <span> {tJob("expiredAt.label")}: </span>
        <Badge variant={"destructive"}>{format.dateTime(data.expiredAt)}</Badge>
      </div>
    </button>
  );
};
