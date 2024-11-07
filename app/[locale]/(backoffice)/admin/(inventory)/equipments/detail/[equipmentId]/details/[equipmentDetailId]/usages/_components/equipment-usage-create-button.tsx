"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { z } from "zod";
import { EquipmentUsageSchema } from "@/schemas";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useTransition } from "react";
import { create } from "@/actions/equipment-usage";
import { toast } from "sonner";

import { DynamicDialogFooter } from "@/components/dialog/dynamic-dialog";
import { useParams } from "next/navigation";
import { ActivitiesSelect } from "@/app/[locale]/(backoffice)/admin/_components/activities-select";
import { DatePickerWithTime } from "@/components/form/date-picker-with-time";
import { StaffsSelect } from "@/app/[locale]/(backoffice)/admin/_components/staffs-select";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import { useAuth } from "@clerk/nextjs";
import { EquipmentDetailsSelect } from "@/app/[locale]/(backoffice)/admin/_components/equipment-details-select";
import { useCurrentStaff } from "@/hooks/use-current-staff";

export const EquipmentUsageCreateButton = () => {
  const tSchema = useTranslations("equipmentUsages.schema");
  const t = useTranslations("equipmentUsages.form");

  const params = useParams<{
    equipmentDetailId: string;
    activityId: string;
  }>();
  const { isOnlyAdmin: canCreate } = useCurrentStaffRole();
  const { currentStaff } = useCurrentStaff();
  const { orgId } = useAuth();

  const formSchema = EquipmentUsageSchema(tSchema);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      equipmentDetailId: params?.equipmentDetailId,
      activityId: params?.activityId,
      usageStartTime: new Date(),
      duration: 1,
    },
  });

  useEffect(() => {
    if (currentStaff) {
      form.setValue("operatorId", currentStaff.id);
    }
  }, [form, currentStaff]);

  const [isPending, startTransition] = useTransition();

  const [isOpen, setOpen] = useState(false);
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(() => {
      create(values)
        .then(({ message, ok }) => {
          if (ok) {
            form.reset();
            setOpen(false);
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
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size={"sm"}
          variant={"success"}
          disabled={isPending || !canCreate}
        >
          <Plus className="h-4 w-4 mr-2" />{" "}
          <span className="text-sm font-semibold">{t("create.label")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{t("create.title")}</DialogTitle>
          <DialogDescription>{t("create.description")}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid lg:grid-cols-2 gap-x-2">
              <FormField
                control={form.control}
                name="equipmentDetailId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("equipmentDetailId.label")}</FormLabel>
                    <FormControl>
                      <EquipmentDetailsSelect
                        onChange={field.onChange}
                        placeholder={tSchema("equipmentDetailId.placeholder")}
                        disabled={
                          isPending || !canCreate || !!params?.equipmentDetailId
                        }
                        error={tSchema("equipmentDetailId.error")}
                        notFound={tSchema("equipmentDetailId.notFound")}
                        defaultValue={field.value}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="operatorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("operatorId.label")}</FormLabel>
                    <FormControl>
                      <StaffsSelect
                        orgId={orgId}
                        onChange={field.onChange}
                        defaultValue={field.value ?? undefined}
                        placeholder={tSchema("operatorId.placeholder")}
                        disabled={isPending || !canCreate}
                        error={tSchema("operatorId.error")}
                        notFound={tSchema("operatorId.notFound")}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid lg:grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="activityId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("activityId.label")}</FormLabel>
                    <FormControl>
                      <ActivitiesSelect
                        onChange={field.onChange}
                        placeholder={tSchema("activityId.placeholder")}
                        disabled={
                          isPending || !canCreate || !!params?.activityId
                        }
                        error={tSchema("activityId.error")}
                        notFound={tSchema("activityId.notFound")}
                        defaultValue={field.value ?? undefined}
                        onSelected={(selectedActivity) => {
                          form.setValue(
                            "location",
                            selectedActivity.crop.field.location
                          );
                        }}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="usageStartTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("usageStartTime.label")}</FormLabel>
                    <FormControl>
                      <DatePickerWithTime
                        onChange={field.onChange}
                        placeholder={tSchema("usageStartTime.placeholder")}
                        disabled={isPending || !canCreate}
                        value={field.value}
                        disabledDateRange={{
                          before: new Date(),
                        }}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid lg:grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("duration.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={tSchema("duration.placeholder")}
                        value={field.value ?? undefined}
                        onChange={field.onChange}
                        disabled={isPending || !canCreate}
                        type="number"
                        min={1}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("note.label")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={tSchema("note.placeholder")}
                      value={field.value ?? undefined}
                      onChange={field.onChange}
                      disabled={isPending || !canCreate}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DynamicDialogFooter disabled={isPending || !canCreate} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
