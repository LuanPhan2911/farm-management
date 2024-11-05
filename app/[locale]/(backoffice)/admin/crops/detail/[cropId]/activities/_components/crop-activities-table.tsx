"use client";

import { ActivitiesTable } from "@/app/[locale]/(backoffice)/admin/activities/_components/activities-table";
import { ActivityTable } from "@/types";
import { useParams } from "next/navigation";

interface CropActivitiesTableProps {
  data: ActivityTable[];
  totalPage: number;
}
export const CropActivitiesTable = ({
  data,
  totalPage,
}: CropActivitiesTableProps) => {
  const params = useParams<{ cropId: string }>();
  return (
    <ActivitiesTable
      data={data}
      totalPage={totalPage}
      detailUrl={(activity) =>
        `crops/detail/${params!.cropId}/activities/detail/${activity.id}`
      }
    />
  );
};
