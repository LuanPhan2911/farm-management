import { getJobById, getJobsSelect } from "@/services/jobs";

import { JobEditForm } from "../../_components/job-edit-button";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { checkRole } from "@/lib/role";

interface JobEditPageProps {
  params: {
    jobId: string;
  };
}
export async function generateMetadata() {
  const t = await getTranslations("jobs.page.edit");
  return {
    title: t("title"),
  };
}

const JobEditPage = async ({ params }: JobEditPageProps) => {
  const data = await getJobById(params!.jobId);
  const t = await getTranslations("jobs.form.edit");

  if (!data || !checkRole("superadmin")) {
    return notFound();
  }
  return (
    <div className="flex flex-col gap-y-4 h-full py-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <JobEditForm job={data} />
        </CardContent>
      </Card>
    </div>
  );
};

export default JobEditPage;
