"use client";

import { destroy, destroyManyUnConfirmed } from "@/actions/weather";
import { Button } from "@/components/ui/button";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import { useAlertDialog } from "@/stores/use-alert-dialog";
import { WeatherTable } from "@/types";

import { Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

interface WeatherDeleteButtonProps {
  data: WeatherTable;
  label: string;
}
export const WeatherDeleteButton = ({
  data,
  label,
}: WeatherDeleteButtonProps) => {
  const { id } = data;
  const { onOpen, onClose, setPending } = useAlertDialog();

  const t = useTranslations("weathers.form");

  const { isFarmer } = useCurrentStaffRole();

  const disabled = data.confirmed && isFarmer;
  const onConfirm = async () => {
    setPending(true);
    destroy(id)
      .then(({ message, ok }) => {
        if (ok) {
          toast.success(message);
        } else {
          toast.error(message);
        }
      })
      .catch((error: Error) => {
        toast.error("Internal error");
      })
      .finally(() => {
        onClose();
      });
  };
  return (
    <Button
      className="w-full"
      onClick={(e) => {
        e.stopPropagation();
        onOpen({
          title: t("destroy.title"),
          description: t("destroy.description"),
          onConfirm,
        });
      }}
      size={"sm"}
      variant={"destroy"}
      disabled={disabled}
    >
      <Trash className="h-4 w-4 mr-2" />
      {label}
    </Button>
  );
};
export const WeatherDeleteManyUnConfirmedButton = () => {
  const { onOpen, onClose, setPending } = useAlertDialog();

  const params = useParams<{
    fieldId: string;
  }>();
  const t = useTranslations("weathers.form");
  const onConfirm = async () => {
    setPending(true);
    destroyManyUnConfirmed(params!.fieldId)
      .then(({ message, ok }) => {
        if (ok) {
          toast.success(message);
        } else {
          toast.error(message);
        }
      })
      .catch((error: Error) => {
        toast.error("Internal error");
      })
      .finally(() => {
        onClose();
      });
  };
  return (
    <Button
      onClick={() =>
        onOpen({
          title: t("destroyManyConfirmed.title"),
          description: t("destroyManyConfirmed.description"),
          onConfirm,
        })
      }
      size={"sm"}
      variant={"destroy"}
    >
      <Trash className="h-4 w-4 mr-2" />
      {t("destroyManyConfirmed.label")}
    </Button>
  );
};
