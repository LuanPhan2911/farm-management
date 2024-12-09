import { parseToDate } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ActivityCreateButton } from "../../../../activities/_components/activity-create-button";
import { CropActivitiesTable } from "./_components/crop-activities-table";
import { getActivitiesByCrop } from "@/services/activities";
import { getCurrentStaffRole } from "@/services/staffs";
import { getOnlyCropById } from "@/services/crops";
import { notFound } from "next/navigation";
import { canUpdateCropStatus } from "@/lib/permission";

interface CropActivitiesPageProps {
  params: {
    cropId: string;
  };
  searchParams: {
    filterString?: string;
    query?: string;
    begin?: string;
    end?: string;
    page?: string;
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
  const t = await getTranslations("crops.page.detail.activities");
  const begin = parseToDate(searchParams!.begin);
  const end = parseToDate(searchParams!.end);

  const { filterString, query } = searchParams;

  const data = await getActivitiesByCrop({
    cropId: params.cropId,
    begin,
    end,
    filterString,
    query,
  });

  const crop = await getOnlyCropById(params.cropId);
  if (!crop) {
    notFound();
  }

  const { isOnlyAdmin } = await getCurrentStaffRole();

  const canCreate = isOnlyAdmin && canUpdateCropStatus(crop.status);

  return (
    <div className="flex flex-col gap-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end">
            <ActivityCreateButton canCreate={canCreate} />
          </div>
          <CropActivitiesTable data={data} />
        </CardContent>
      </Card>
    </div>
  );
};

export default CropActivitiesPage;
