import { getJobsTable } from "@/services/jobs";
import { JobsTable } from "./_components/jobs-data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JobCreateButton } from "./_components/job-create-button";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("jobs.page");
  return {
    title: t("title"),
  };
}
const JobsPage = async () => {
  const data = await getJobsTable();
  const t = await getTranslations("jobs.page");

  return (
    <div className="flex flex-col gap-y-4 h-full py-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end">
            <JobCreateButton />
          </div>
          <JobsTable data={data} />
        </CardContent>
      </Card>
    </div>
  );
};

export default JobsPage;
