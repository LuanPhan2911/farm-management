import { Suspense } from "react";
import { getJobBySlug, getLatestJob } from "@/services/jobs";
import { JobList, JobListSkeleton } from "../_components/job-list";
import {
  JobCardDisplay,
  JobCardDisplaySkeleton,
} from "../_components/job-card-display";
import { cn } from "@/lib/utils";
interface JobsPageProps {
  searchParams?: {
    query?: string;
  };
  params: {
    jobId?: string[];
  };
}
const JobsPage = async ({ searchParams, params }: JobsPageProps) => {
  const jobId = params!.jobId?.[0];

  const queryString = searchParams?.query || "";
  let data;
  if (!jobId) {
    data = await getLatestJob();
  } else {
    data = await getJobBySlug(jobId);
  }

  return (
    <div className="grid  grid-cols-1 md:grid-cols-3 gap-4">
      <div className={cn("hidden md:block", !jobId && "block")}>
        <Suspense fallback={<JobListSkeleton />}>
          <JobList query={queryString} activeId={data?.id} />
        </Suspense>
      </div>
      <div className={cn("col-span-2 md:block hidden", jobId && "block")}>
        <Suspense fallback={<JobCardDisplaySkeleton />}>
          <JobCardDisplay data={data} />
        </Suspense>
      </div>
    </div>
  );
};

export default JobsPage;
