import { getJobsAll } from "@/services/jobs";
import { Heading } from "../_components/heading";
import { JobCreateButton } from "./_components/job-create-button";
import { JobsTable } from "./_components/jobs-data-table";

const JobsPage = async () => {
  const data = await getJobsAll();
  return (
    <div className="flex flex-col gap-y-4 h-full">
      <Heading title="Jobs" />
      <div className="ml-auto">
        <JobCreateButton />
      </div>
      <JobsTable data={data} />
    </div>
  );
};

export default JobsPage;
