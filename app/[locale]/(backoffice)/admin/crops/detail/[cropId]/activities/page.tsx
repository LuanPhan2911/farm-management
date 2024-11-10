import { getActivities } from "@/services/activities";

import { parseToDate, parseToNumber } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ActivityCreateButton } from "../../../../activities/_components/activity-create-button";
import { ActivitiesTable } from "../../../../activities/_components/activities-table";

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
  const page = parseToNumber(searchParams!.page, 1);
  const t = await getTranslations("crops.page.detail.activities");
  const begin = parseToDate(searchParams!.begin);
  const end = parseToDate(searchParams!.end);
  const { orderBy, filterNumber, filterString, query, type } = searchParams;

  const { data, totalPage } = await getActivities({
    filterNumber,
    filterString,
    orderBy,
    page,
    query,
    cropId: params.cropId,
    type: type === "createdBy" ? "createdBy" : undefined,
    begin,
    end,
  });
  return (
    <div className="flex flex-col gap-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end">
            <ActivityCreateButton />
          </div>
          <ActivitiesTable data={data} totalPage={totalPage} />
        </CardContent>
      </Card>
    </div>
  );
};

export default CropActivitiesPage;
