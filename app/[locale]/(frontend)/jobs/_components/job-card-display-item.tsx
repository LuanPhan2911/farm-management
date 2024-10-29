"use client";

import { SmallCard } from "@/components/small-card";
import { TiptapContent } from "@/components/tiptap";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Job } from "@prisma/client";
import { Calendar, DollarSign, Target, Timer, User, Users } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { JobApplyButton } from "./job-apply-button";

interface JobCardDisplayItemProps {
  data: Job;
}
export const JobCardDisplayItem = ({ data }: JobCardDisplayItemProps) => {
  const format = useFormatter();
  const tJob = useTranslations("jobs.schema");
  const tCard = useTranslations("jobs.card");
  return (
    <Card className="py-6">
      <CardContent>
        <div className="flex flex-1 flex-col py-6 md:px-3 px-0">
          <div className="flex justify-end">
            <Badge variant={"info"}>
              {format.relativeTime(data.createdAt)}
            </Badge>
          </div>

          <div className="flex mt-6 text-justify md:text-lg text-md font-semibold">
            {data.name}
          </div>
          <Separator className="my-4" />
          <div className="flex flex-col gap-y-2">
            <h2 className="md:text-lg text-md font-semibold">
              {tCard("info")}
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <SmallCard
                title={tJob("wage.label")}
                icon={DollarSign}
                value={data.wage}
              />
              <SmallCard
                title={tJob("gender.label")}
                icon={User}
                value={tJob(`gender.options.${data.gender}`)}
              />
              <SmallCard
                title={tJob("quantity.label")}
                icon={Users}
                value={`${data.quantity}`}
              />
              <SmallCard
                title={tJob("workingState.label")}
                icon={Target}
                value={tJob(`workingState.options.${data.workingState}`)}
              />
              <SmallCard
                title={tJob("experience.label")}
                icon={Calendar}
                value={tJob(`experience.options.${data.experience}`)}
              />
              <SmallCard
                title={tJob("expiredAt.label")}
                icon={Timer}
                value={format.dateTime(data.expiredAt)}
              />
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex flex-col gap-y-2">
            <h2 className="md:text-lg text-md font-semibold">
              {tCard("description")}
            </h2>
            <TiptapContent content={data.description} />
          </div>
          <Separator className="my-4" />
          <div className="flex flex-col gap-y-2">
            <h2 className="md:text-lg text-md font-semibold">
              {tCard("requirement")}
            </h2>
            <TiptapContent content={data.requirement} />
          </div>
          <Separator className="my-4" />
          <div className="flex flex-col gap-y-2">
            <h2 className="md:text-lg text-md font-semibold">
              {tCard("rights")}
            </h2>
            <TiptapContent content={data.rights} />
          </div>
          <Separator className="my-4" />
          <div className="flex items-center justify-center">
            <JobApplyButton jobId={data.id} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export const JobCardDisplayItemSkeleton = () => {
  return (
    <Card className="py-6">
      <CardContent>
        <div className="flex flex-1 flex-col relative py-6 md:px-3 px-0">
          <div className="absolute top-1 right-1">
            <Skeleton className="w-20 h-5" />
          </div>
          <div className="absolute top-1 left-3">
            <Skeleton className="w-20 h-5" />
          </div>
          <div className="mt-6">
            <Skeleton className="h-20 w-full" />
          </div>
          <div className="my-4">
            <Skeleton className="h-48 w-full" />
          </div>
          <div className="my-4">
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
