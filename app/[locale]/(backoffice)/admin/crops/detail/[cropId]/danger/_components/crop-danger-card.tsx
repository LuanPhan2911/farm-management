"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { DestroyButton } from "@/components/buttons/destroy-button";

import { destroy } from "@/actions/crop";
import { useTranslations } from "next-intl";
import { CropFinishButton } from "../../../../_components/crop-edit-status-button";
import { CustomAlert } from "@/components/cards/custom-alert";
import { DestroyButtonWithConfirmCode } from "@/components/buttons/destroy-button-with-confirm-code";

interface CropDangerCardProps {
  id: string;
  canEdit?: boolean;
  canDelete?: boolean;
  redirectUrl?: string;
}
export const CropDangerCard = ({
  id,
  canDelete,
  canEdit,
  redirectUrl,
}: CropDangerCardProps) => {
  const tDanger = useTranslations("crops.danger");
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{tDanger("finish.title")}</CardTitle>
          <CardDescription>
            {tDanger("finish.description.note")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CustomAlert
            variant={"success"}
            description={tDanger("finish.description.learnedLessons")}
          />
          <CustomAlert
            variant={"info"}
            description={tDanger("finish.description.endDate")}
          />
          <CustomAlert
            variant={"info"}
            description={tDanger("finish.description.actualYield")}
          />
          <CustomAlert
            variant={"destructive"}
            description={tDanger("finish.description.endDateValid")}
          />
          <CustomAlert
            variant={"destructive"}
            description={tDanger("finish.description.activityComplete")}
          />
          <CustomAlert
            variant={"destructive"}
            description={tDanger("finish.description.finish")}
          />
          <CropFinishButton id={id} disabled={!canEdit} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{tDanger("destroy.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomAlert
            variant={"destructive"}
            description={tDanger("destroy.description.cropFinish")}
          />
          <CustomAlert
            variant={"destructive"}
            description={tDanger("destroy.description.activityCount")}
          />
          <DestroyButtonWithConfirmCode
            destroyFn={destroy}
            id={id}
            inltKey="crops"
            redirectHref={redirectUrl}
            disabled={!canDelete}
            confirmCode="DELETE_CROP"
          />
        </CardContent>
      </Card>
    </>
  );
};
