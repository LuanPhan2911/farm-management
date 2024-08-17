import { getJobsTable } from "@/services/jobs";

import { JobCreateButton } from "./_components/job-create-button";
import { JobsTable } from "./_components/jobs-data-table";

const JobsPage = async () => {
  const data = await getJobsTable();
  return (
    <div className="flex flex-col gap-y-4 h-full">
      <div className="ml-auto">
        <JobCreateButton />
      </div>
      <JobsTable data={data} />
    </div>
  );
};

export default JobsPage;
