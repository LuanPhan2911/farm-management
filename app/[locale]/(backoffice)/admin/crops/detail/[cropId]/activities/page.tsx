import { getActivities } from "@/services/activities";

import { parseToNumber } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getCurrentStaff } from "@/services/staffs";
import { notFound } from "next/navigation";
import { ActivityCreateButton } from "../../../../activities/_components/activity-create-button";
import { ActivitiesTable } from "../../../../activities/_components/activities-table";
import { CropActivityCreateButton } from "./_components/crop-activity-create-button";
import { CropActivitiesTable } from "./_components/crop-activities-table";

interface CropActivitiesPageProps {
  params: {
    cropId: string;
  };
  searchParams: {
    page?: string;
    orderBy?: string;
    filterString?: string;
    filterNumber?: string;
    query?: string;
    type?: string;
  };
}
export async function generateMetadata() {
  const t = await getTranslations("crops.page.detail.activities");
  return {
    title: t("title"),
  };
}

const CropActivitiesPage = async ({
  params,
  searchParams,
}: CropActivitiesPageProps) => {
  const page = parseToNumber(searchParams!.page, 1);
  const t = await getTranslations("crops.page.detail.activities");

  const { orderBy, filterNumber, filterString, query, type } = searchParams;
  const currentStaff = await getCurrentStaff();
  if (!currentStaff) {
    notFound();
  }
  const { data, totalPage } = await getActivities({
    filterNumber,
    filterString,
    orderBy,
    page,
    query,
    staffId: currentStaff.id,
    cropId: params.cropId,
    type: type === "createdBy" ? "createdBy" : undefined,
  });
  return (
    <div className="flex flex-col gap-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end">
            <CropActivityCreateButton />
          </div>
          <CropActivitiesTable data={data} totalPage={totalPage} />
        </CardContent>
      </Card>
    </div>
  );
};

export default CropActivitiesPage;
