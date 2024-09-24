import { getApplicants } from "@/services/applicants";

import { ApplicantsTable } from "./_components/applicants-data-table";

interface ApplicantsPageProps {
  searchParams: {
    jobId?: string;
  };
}
const ApplicantsPage = async ({ searchParams }: ApplicantsPageProps) => {
  const jobId = searchParams.jobId;
  const applicants = await getApplicants({
    jobId,
  });

  return (
    <div className="flex flex-col gap-y-4 h-full py-4">
      <ApplicantsTable applicants={applicants} />
    </div>
  );
};

export default ApplicantsPage;
