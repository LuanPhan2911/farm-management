import { getJobBySlug } from "@/services/jobs";
import {
  JobCardDisplayItem,
  JobCardDisplayItemSkeleton,
} from "./job-card-display-item";

import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import { Job } from "@prisma/client";

interface JobCardDisplayProps {
  data: Job | null;
}
export const JobCardDisplay = async ({ data }: JobCardDisplayProps) => {
  const tCard = await getTranslations("jobs.card");
  if (!data) {
    return (
      <div className="flex flex-col gap-y-4 justify-center items-center h-[400px]">
        <div className="text-center text-lg font-semibold">
          {tCard("noJob.label")}
        </div>
        <Link href={"/"}>
          <Button variant={"success"}>{tCard("noJob.backLabel")}</Button>
        </Link>
      </div>
    );
  }

  return <JobCardDisplayItem data={data} />;
};
interface JobCardDisplayBySlugProps {
  slug: string;
}
export const JobCardDisplayBySlug = async ({
  slug,
}: JobCardDisplayBySlugProps) => {
  const tCard = await getTranslations("jobs.card");
  const job = await getJobBySlug(slug);

  if (!job) {
    return (
      <div className="flex flex-col gap-y-4 justify-center items-center h-[400px]">
        <div className="text-center text-lg font-semibold">
          {tCard("noJob.label")}
        </div>
        <Link href={"/"}>
          <Button variant={"success"}>{tCard("noJob.backLabel")}</Button>
        </Link>
      </div>
    );
  }

  return <JobCardDisplayItem data={job} />;
};

export const JobCardDisplaySkeleton = () => {
  return <JobCardDisplayItemSkeleton />;
};
export const JobCardDisplayBySlugSkeleton = () => {
  return <JobCardDisplayItemSkeleton />;
};
