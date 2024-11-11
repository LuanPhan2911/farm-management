import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { JobCreateForm } from "../_components/job-create-button";
import { getTranslations } from "next-intl/server";
import { checkRole } from "@/lib/role";
import { notFound } from "next/navigation";

const JobCreatePage = async () => {
  const t = await getTranslations("jobs.form");
  if (!checkRole("superadmin")) {
    notFound();
  }
  return (
    <div className="flex flex-col gap-y-4 h-full py-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("create.title")}</CardTitle>
          <CardDescription>{t("create.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <JobCreateForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default JobCreatePage;
