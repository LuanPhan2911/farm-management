"use client";

import { editConfirmed, editManyConfirmed } from "@/actions/weather";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAlertDialog } from "@/stores/use-alert-dialog";
import { WeatherTable } from "@/types";
import { Check, Edit } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

interface WeatherConfirmButtonProps {
  data: WeatherTable;
  isButton?: boolean;
}
export const WeatherConfirmButton = ({
  data,
  isButton = false,
}: WeatherConfirmButtonProps) => {
  const { onOpen, setPending, isPending } = useAlertDialog();

  const t = useTranslations("weathers");

  const onClick = () => {
    setPending(true);
    editConfirmed(data.id, !data.confirmed)
      .then(({ message, ok }) => {
        if (ok) {
          toast.success(message);
        } else {
          toast.error(message);
        }
      })
      .catch((error: Error) => {
        toast.error(t("status.failure.editConfirmed"));
      });
  };
  if (isButton) {
    return (
      <Button
        className="w-full"
        variant={"cyan"}
        size={"sm"}
        onClick={(e) => {
          e.stopPropagation();
          onOpen({
            title: t("form.editConfirmed.title"),
            description: t("form.editConfirmed.description"),
            onConfirm: () => onClick(),
          });
        }}
      >
        <Check className="h-4 w-4 mr-2" />
        {t("form.editConfirmed.label")}
      </Button>
    );
  }
  return (
    <Switch
      checked={data.confirmed}
      onClick={(e) => {
        e.stopPropagation();
        onOpen({
          title: t("form.editConfirmed.title"),
          description: t("form.editConfirmed.description"),
          onConfirm: () => onClick(),
        });
      }}
      disabled={isPending}
    />
  );
};

export const WeathersConfirmedAllButton = () => {
  const { onOpen, setPending } = useAlertDialog();

  const t = useTranslations("weathers");
  const params = useParams<{
    fieldId: string;
  }>();
  const onClick = () => {
    setPending(true);
    editManyConfirmed(params.fieldId)
      .then(({ message, ok }) => {
        if (ok) {
          toast.success(message);
        } else {
          toast.error(message);
        }
      })
      .catch((error: Error) => {
        toast.error(t("status.failure.editManyConfirmed"));
      });
  };
  return (
    <Button
      size={"sm"}
      variant={"edit"}
      onClick={() => {
        onOpen({
          title: t("form.editManyConfirmed.title"),
          description: t("form.editManyConfirmed.description"),
          onConfirm: () => onClick(),
        });
      }}
    >
      <Edit className="h-4 w-4 mr-2" /> {t("form.editManyConfirmed.label")}
    </Button>
  );
};
