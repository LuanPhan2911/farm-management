"use client";
import {
  DynamicDialog,
  DynamicDialogFooter,
} from "@/components/dialog/dynamic-dialog";
import { EquipmentUsageSchema, EquipmentUsageUpdateSchema } from "@/schemas";
import { useDialog } from "@/stores/use-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { edit } from "@/actions/equipment-usage";
import { Input } from "@/components/ui/input";
import { EquipmentUsageTable } from "@/types";
import { DatePickerWithTime } from "@/components/form/date-picker-with-time";
import { Textarea } from "@/components/ui/textarea";
import { EditButton } from "@/components/buttons/edit-button";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import { UnitsSelect } from "@/app/[locale]/(backoffice)/admin/_components/units-select";
import { UnitType } from "@prisma/client";
import { StaffsSelect } from "@/app/[locale]/(backoffice)/admin/_components/staffs-select";
import { useAuth } from "@clerk/nextjs";

interface EquipmentUsageEditButtonProps {
  data: EquipmentUsageTable;

  disabled?: boolean;
}

export const EquipmentUsageEditButton = ({
  data,

  disabled,
}: EquipmentUsageEditButtonProps) => {
  return (
    <EditButton
      inltKey="equipmentUsages"
      type="equipmentUsage.edit"
      className="w-full"
      data={{
        equipmentUsage: data,
      }}
      disabled={disabled}
    />
  );
};
export const EquipmentUsageEditDialog = () => {
  const { isOpen, type, data, onClose } = useDialog();
  const isOpenDialog = isOpen && type === "equipmentUsage.edit";

  const tSchema = useTranslations("equipmentUsages.schema");
  const t = useTranslations("equipmentUsages.form");
  const formSchema = EquipmentUsageUpdateSchema(tSchema);

  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { isOnlyAdmin } = useCurrentStaffRole();
  const { orgId } = useAuth();
  const [id, setId] = useState("");
  useEffect(() => {
    if (data?.equipmentUsage) {
      form.reset(data.equipmentUsage);
      setId(data.equipmentUsage.id);
    }
  }, [data, form]);
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!id) {
      return;
    }
    startTransition(() => {
      edit(values, id)
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

  const canEdit = isOnlyAdmin && data.equipmentUsage?.activityId === null;

  return (
    <DynamicDialog
      isOpen={isOpenDialog}
      title={t("edit.title")}
      description={t("edit.description")}
      className="max-w-4xl"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid lg:grid-cols-2 gap-2">
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
                      disabled={isPending || !canEdit}
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
                      disabled={isPending || !canEdit}
                      type="number"
                      min={1}
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
                      disabled={isPending || !canEdit}
                      error={tSchema("operatorId.error")}
                      notFound={tSchema("operatorId.notFound")}
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
                      <FormLabel>{tSchema("fuelConsumption.label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={tSchema("fuelConsumption.placeholder")}
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
                        disabled={isPending || !canEdit}
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
                      disabled={isPending || !canEdit}
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
                    disabled={isPending || !canEdit}
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
