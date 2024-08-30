import { getJobsTable } from "@/services/jobs";
import { JobsTable } from "./_components/jobs-data-table";

const JobsPage = async () => {
  const data = await getJobsTable();
  return (
    <div className="flex flex-col gap-y-4 h-full py-4">
      <JobsTable data={data} />
    </div>
  );
};

export default JobsPage;
