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
import { useAuth } from "@clerk/nextjs";
import { EquipmentDetailsSelect } from "@/app/[locale]/(backoffice)/admin/_components/equipment-details-select";
import { useCurrentStaff } from "@/hooks/use-current-staff";
import { UnitsSelect } from "@/app/[locale]/(backoffice)/admin/_components/units-select";
import { UnitType } from "@prisma/client";
import { ManagePermission } from "@/types";

interface EquipmentUsageCreateButtonProps extends ManagePermission {}
export const EquipmentUsageCreateButton = ({
  canCreate,
}: EquipmentUsageCreateButtonProps) => {
  const tSchema = useTranslations("equipmentUsages.schema");
  const t = useTranslations("equipmentUsages.form");

  const params = useParams<{
    equipmentDetailId: string;
    activityId: string;
  }>();
  const { currentStaff } = useCurrentStaff();
  const { orgId } = useAuth();

  const [maxFuelConsumption, setMaxFuelConsumption] = useState<
    number | undefined
  >(undefined);
  const formSchema = EquipmentUsageSchema(tSchema);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      equipmentDetailId: params?.equipmentDetailId,
      activityId: params?.activityId,
      usageStartTime: new Date(),
      duration: 1,
      unitId: null,
      fuelConsumption: null,
      fuelPrice: null,
      rentalPrice: null,
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

  const disabled = isPending || !canCreate;
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={"sm"} variant={"success"} disabled={disabled}>
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
                        disabled={disabled || !!params?.equipmentDetailId}
                        error={tSchema("equipmentDetailId.error")}
                        notFound={tSchema("equipmentDetailId.notFound")}
                        defaultValue={field.value}
                        onSelected={(equipmentDetail) => {
                          form.setValue(
                            "fuelPrice",
                            equipmentDetail.baseFuelPrice
                          );
                          form.setValue(
                            "fuelConsumption",
                            equipmentDetail.maxFuelConsumption
                              ? equipmentDetail.maxFuelConsumption * 0.8
                              : null
                          );

                          form.setValue("unitId", equipmentDetail.unit?.id);
                          setMaxFuelConsumption(
                            equipmentDetail.maxFuelConsumption || 10000
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
                        disabled={disabled}
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
                        disabled={disabled || !!params?.activityId}
                        error={tSchema("activityId.error")}
                        notFound={tSchema("activityId.notFound")}
                        defaultValue={field.value ?? undefined}
                        onSelected={(selectedActivity) => {
                          form.setValue(
                            "usageStartTime",
                            new Date(selectedActivity.activityDate)
                          );
                          form.setValue(
                            "duration",
                            selectedActivity.estimatedDuration
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
                        disabled={disabled}
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
                        disabled={disabled}
                        type="number"
                        max={100}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-3">
                  <FormField
                    control={form.control}
                    name="fuelConsumption"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {tSchema("fuelConsumption.label")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={tSchema("fuelConsumption.placeholder")}
                            value={field.value ?? undefined}
                            onChange={field.onChange}
                            disabled={disabled}
                            type="number"
                            min={0}
                            max={maxFuelConsumption}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="unitId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tSchema("unitId.label")}</FormLabel>
                      <FormControl>
                        <UnitsSelect
                          onChange={field.onChange}
                          placeholder={tSchema("unitId.placeholder")}
                          unitType={UnitType.VOLUME}
                          disabled={disabled}
                          className="w-full"
                          error={tSchema("unitId.error")}
                          notFound={tSchema("unitId.notFound")}
                          defaultValue={field.value}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid lg:grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="fuelPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("fuelPrice.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={tSchema("fuelPrice.placeholder")}
                        value={field.value ?? undefined}
                        onChange={field.onChange}
                        disabled={disabled}
                        type="number"
                        min={0}
                        max={1_000_000}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rentalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("rentalPrice.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={tSchema("rentalPrice.placeholder")}
                        value={field.value ?? undefined}
                        onChange={field.onChange}
                        disabled={disabled}
                        type="number"
                        min={0}
                        max={10_000_000}
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
                      disabled={disabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DynamicDialogFooter disabled={disabled} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
