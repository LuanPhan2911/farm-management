import { JobList, JobListSkeleton } from "./_components/job-list";
import {
  JobCardDisplay,
  JobCardDisplaySkeleton,
} from "./_components/job-card-display";
import { Suspense } from "react";
import { getLatestJob } from "@/services/jobs";
interface JobsPageProps {
  searchParams?: {
    query?: string;
  };
}
const JobsPage = async ({ searchParams }: JobsPageProps) => {
  const queryString = searchParams?.query || "";
  const data = await getLatestJob();

  return (
    <div className="grid  grid-cols-1 md:grid-cols-3 gap-4">
      <div className="col-span-1">
        <Suspense fallback={<JobListSkeleton />}>
          <JobList query={queryString} />
        </Suspense>
      </div>
      <div className="col-span-2 md:block hidden">
        <Suspense fallback={<JobCardDisplaySkeleton />}>
          <JobCardDisplay data={data} />
        </Suspense>
      </div>
    </div>
  );
};

export default JobsPage;
