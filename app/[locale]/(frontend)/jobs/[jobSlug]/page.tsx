import { JobList, JobListSkeleton } from "../_components/job-list";
import {
  JobCardDisplayBySlug,
  JobCardDisplayBySlugSkeleton,
} from "../_components/job-card-display";
import { Suspense } from "react";

interface JobDetailPageProps {
  params: {
    jobSlug: string;
  };
  searchParams?: {
    query?: string;
  };
}

const JobDetailPage = async ({ params, searchParams }: JobDetailPageProps) => {
  const queryString = searchParams?.query || "";

  return (
    <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
      <div className="col-span-1 md:block hidden">
        <Suspense fallback={<JobListSkeleton />}>
          <JobList query={queryString} />
        </Suspense>
      </div>
      <div className="col-span-2">
        <Suspense fallback={<JobCardDisplayBySlugSkeleton />}>
          <JobCardDisplayBySlug slug={params.jobSlug} />
        </Suspense>
      </div>
    </div>
  );
};

export default JobDetailPage;
