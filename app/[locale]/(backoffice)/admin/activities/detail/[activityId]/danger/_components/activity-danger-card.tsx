"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { DestroyButton } from "@/components/buttons/destroy-button";
import { destroy } from "@/actions/activity";
import { ActivityCompletedButton } from "@/app/[locale]/(backoffice)/admin/activities/_components/activity-edit-status-button";
import { CustomAlert } from "@/components/cards/custom-alert";
import { useTranslations } from "next-intl";

interface ActivityDangerCardProps {
  id: string;
  canEdit?: boolean;
  canDelete?: boolean;
  redirectUrl?: string;
}
export const ActivityDangerCard = ({
  id,
  canDelete,
  canEdit,
  redirectUrl,
}: ActivityDangerCardProps) => {
  const tDanger = useTranslations("activities.danger");
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{tDanger("complete.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomAlert
            variant={"info"}
            description={tDanger("complete.description.actualWork")}
          />
          <CustomAlert
            variant={"info"}
            description={tDanger("complete.description.actualDuration")}
          />
          <CustomAlert
            variant={"destructive"}
            description={tDanger("complete.description.completed")}
          />
          <CustomAlert
            variant={"destructive"}
            description={tDanger("complete.description.hourlyWage")}
          />

          <ActivityCompletedButton activityId={id} disabled={!canEdit} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{tDanger("destroy.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomAlert
            variant={"destructive"}
            description={tDanger("destroy.description.usages")}
          />
          <DestroyButton
            destroyFn={destroy}
            id={id}
            inltKey="activities"
            redirectHref={redirectUrl}
            disabled={!canDelete}
          />
        </CardContent>
      </Card>
    </>
  );
};
