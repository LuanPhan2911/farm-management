import { getActivitiesByCrop } from "@/services/activities";

import { parseToDate } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ActivityCreateButton } from "../../../../activities/_components/activity-create-button";
import { CropActivitiesTable } from "./_components/crop-activities-table";
import { canUpdateActivity, canUpdateCrop } from "@/lib/role";

interface CropActivitiesPageProps {
  params: {
    cropId: string;
  };
  searchParams: {
    orderBy?: string;
    filterString?: string;
    filterNumber?: string;
    query?: string;
    begin?: string;
    end?: string;
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
  const { orderBy, filterNumber, filterString, query } = searchParams;

  const { data, totalCost } = await getActivitiesByCrop({
    filterNumber,
    filterString,
    orderBy,
    query,
    cropId: params.cropId,
    begin,
    end,
  });
  const canEdit = await canUpdateActivity(params.cropId);
  return (
    <div className="flex flex-col gap-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end">
            <ActivityCreateButton disabled={!canEdit} />
          </div>
          <CropActivitiesTable data={data} totalCost={totalCost} />
        </CardContent>
      </Card>
    </div>
  );
};

export default CropActivitiesPage;
