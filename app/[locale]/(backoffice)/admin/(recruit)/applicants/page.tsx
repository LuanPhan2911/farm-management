import { getApplicants } from "@/services/applicants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApplicantsTable } from "./_components/applicants-data-table";
import { getTranslations } from "next-intl/server";
import { JobSelectWithQueryClient } from "../../_components/jobs-select";

interface ApplicantsPageProps {
  searchParams: {
    jobId?: string;
  };
}
export async function generateMetadata() {
  const t = await getTranslations("applicants.page");
  return {
    title: t("title"),
  };
}

const ApplicantsPage = async ({ searchParams }: ApplicantsPageProps) => {
  const jobId = searchParams.jobId;
  const applicants = await getApplicants({
    jobId,
  });
  const t = await getTranslations("applicants.page");

  return (
    <div className="flex flex-col gap-y-4 h-full py-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <JobSelectWithQueryClient />
          <ApplicantsTable applicants={applicants} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicantsPage;
