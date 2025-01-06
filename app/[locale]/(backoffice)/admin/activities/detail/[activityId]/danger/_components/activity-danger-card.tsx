"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { DestroyButton } from "@/components/buttons/destroy-button";
import { destroy } from "@/actions/activity";
import { ActivityCompletedButton } from "@/app/[locale]/(backoffice)/admin/activities/_components/activity-edit-status-button";
import { CustomAlert } from "@/components/cards/custom-alert";
import { useTranslations } from "next-intl";
import { DestroyButtonWithConfirmCode } from "@/components/buttons/destroy-button-with-confirm-code";
import { ManagePermission } from "@/types";

interface ActivityDangerCardProps extends ManagePermission {
  id: string;
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
          <CardDescription>
            {tDanger("complete.description.note")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CustomAlert
            variant={"info"}
            description={tDanger("complete.description.actualDuration")}
          />
          <CustomAlert
            variant={"info"}
            description={tDanger("complete.description.actualWork")}
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
          <CardDescription>
            {tDanger("destroy.description.note")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CustomAlert
            variant={"info"}
            description={tDanger("destroy.description.finish")}
          />
          <CustomAlert
            variant={"destructive"}
            description={tDanger("destroy.description.usages")}
          />
          <DestroyButtonWithConfirmCode
            destroyFn={destroy}
            id={id}
            inltKey="activities"
            redirectHref={redirectUrl}
            disabled={!canDelete}
            confirmCode="DELETE_ACTIVITY"
          />
        </CardContent>
      </Card>
    </>
  );
};
