"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { DestroyButton } from "@/components/buttons/destroy-button";

import { getCurrentStaff } from "@/services/staffs";

import { canUpdateCropStatus, isSuperAdmin } from "@/lib/permission";
import { getCropByIdWithCount } from "@/services/crops";
import { destroy } from "@/actions/crop";
import { useTranslations } from "next-intl";
import { CropFinishButton } from "../../../../_components/crop-edit-status-button";
import { CustomAlert } from "@/components/cards/custom-alert";

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
        </CardHeader>
        <CardContent>
          <CustomAlert
            variant={"destructive"}
            description={tDanger("finish.description.activityComplete")}
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
            description={tDanger("destroy.description.activityCount")}
          />
          <DestroyButton
            destroyFn={destroy}
            id={id}
            inltKey="crops"
            redirectHref={redirectUrl}
            disabled={!canDelete}
          />
        </CardContent>
      </Card>
    </>
  );
};
