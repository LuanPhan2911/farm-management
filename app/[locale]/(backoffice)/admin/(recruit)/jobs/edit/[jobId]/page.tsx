import { getJobById } from "@/services/jobs";

import { JobEditForm } from "../../_components/job-edit-button";
import { notFound } from "next/navigation";

interface JobEditPageProps {
  params: {
    jobId: string;
  };
}
const JobEditPage = async ({ params }: JobEditPageProps) => {
  const data = await getJobById(params.jobId);
  if (!data) {
    return notFound();
  }
  return (
    <div className="flex flex-col gap-y-4 h-full py-4">
      <JobEditForm job={data} />
    </div>
  );
};

export default JobEditPage;
