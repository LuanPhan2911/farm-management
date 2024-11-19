import { parseToDate, parseToNumber } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ActivityCreateButton } from "../../../../activities/_components/activity-create-button";
import { canUpdateActivity } from "@/lib/role";
import { CropActivitiesTable } from "./_components/crop-activities-table";
import { getActivitiesByCrop } from "@/services/activities";

interface CropActivitiesPageProps {
  params: {
    cropId: string;
  };
  searchParams: {
    orderBy?: string;
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

  const { orderBy, filterString, query } = searchParams;

  const data = await getActivitiesByCrop({
    cropId: params.cropId,
    begin,
    end,
    filterString,
    orderBy,
    query,
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
          <CropActivitiesTable data={data} />
        </CardContent>
      </Card>
    </div>
  );
};

export default CropActivitiesPage;
