import { getApplicants } from "@/services/applicants";

import { ApplicantsTable } from "./_components/applicants-data-table";
import { ApplicantSelectJob } from "./_components/applicant-select-job";
import { getJobsSelection } from "@/services/jobs";
interface ApplicantsPageProps {
  searchParams?: {
    filter?: string;
  };
}
const ApplicantsPage = async ({ searchParams }: ApplicantsPageProps) => {
  const jobId = searchParams?.filter || null;
  const applicants = await getApplicants(jobId);

  return (
    <div className="flex flex-col gap-y-4 h-full py-4">
      <ApplicantsTable applicants={applicants} />
    </div>
  );
};

export default ApplicantsPage;
