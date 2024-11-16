"use client";
import {
  DynamicDialog,
  DynamicDialogFooter,
} from "@/components/dialog/dynamic-dialog";
import { ActivityAssignedUpdateSchema } from "@/schemas";
import { useDialog } from "@/stores/use-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { EditButton } from "@/components/buttons/edit-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { StaffWithSalaryAndActivity } from "@/types";
import { editAssigned } from "@/actions/activity-assigned";
import { canUpdateActivityStatus } from "@/lib/permission";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";

interface ActivityStaffEditButtonProps {
  data: StaffWithSalaryAndActivity;
  disabled?: boolean;
}

export const ActivityStaffsEditButton = ({
  data,
  disabled,
}: ActivityStaffEditButtonProps) => {
  return (
    <EditButton
      inltKey="activityAssigned"
      type="activityAssigned.edit"
      data={{ activityAssigned: data }}
      className="w-full"
      disabled={disabled}
    />
  );
};
export const ActivityStaffEditDialog = () => {
  const { isOpen, type, data, onClose } = useDialog();
  const isOpenDialog = isOpen && type === "activityAssigned.edit";

  const tSchema = useTranslations("activityAssigned.schema");
  const t = useTranslations("activityAssigned.form");
  const formSchema = ActivityAssignedUpdateSchema(tSchema);
  const { isOnlyAdmin } = useCurrentStaffRole();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const [id, setId] = useState("");

  useEffect(() => {
    if (data?.activityAssigned) {
      const { actualWork, hourlyWage, activity, staff } = data.activityAssigned;
      form.reset({
        actualWork: actualWork || activity.estimatedDuration,
        hourlyWage: hourlyWage || staff.baseHourlyWage,
      });
      setId(data.activityAssigned?.id);
    }
  }, [data, form]);
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!id) {
      return;
    }
    startTransition(() => {
      editAssigned(values, id)
        .then(({ message, ok }) => {
          if (ok) {
            onClose();
            toast.success(message);
          } else {
            toast.error(message);
          }
        })
        .catch((error: Error) => {
          toast.error("Internal error");
        });
    });
  };

  const canEdit =
    data.activityAssigned &&
    canUpdateActivityStatus(data.activityAssigned.activity.status) &&
    isOnlyAdmin;
  return (
    <DynamicDialog
      isOpen={isOpenDialog}
      title={t("edit.title")}
      description={t("edit.description")}
      className="max-w-xl"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="actualWork"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("actualWork.label")}</FormLabel>

                <FormControl>
                  <Input
                    placeholder={tSchema("actualWork.placeholder")}
                    value={field.value ?? undefined}
                    onChange={field.onChange}
                    disabled={isPending || !canEdit}
                    type="number"
                    min={0}
                    max={10_000}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hourlyWage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("hourlyWage.label")}</FormLabel>

                <FormControl>
                  <Input
                    placeholder={tSchema("hourlyWage.placeholder")}
                    value={field.value ?? undefined}
                    onChange={field.onChange}
                    disabled={isPending || !canEdit}
                    type="number"
                    min={0}
                    max={1_000_000}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <DynamicDialogFooter disabled={isPending || !canEdit} />
        </form>
      </Form>
    </DynamicDialog>
  );
};
