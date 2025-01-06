"use client";
import {
  DynamicDialog,
  DynamicDialogFooter,
} from "@/components/dialog/dynamic-dialog";
import { EquipmentDetailSchema } from "@/schemas";
import { useDialog } from "@/stores/use-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { EquipmentStatus, UnitType } from "@prisma/client";
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
import { edit } from "@/actions/equipment-detail";
import { Input } from "@/components/ui/input";
import { SelectOptions } from "@/components/form/select-options";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import { canUpdateEquipmentDetail } from "@/lib/permission";
import { CategoriesSelect } from "@/app/[locale]/(backoffice)/admin/_components/categories-select";
import { UnitsSelect } from "@/app/[locale]/(backoffice)/admin/_components/units-select";

export const EquipmentDetailEditDialog = () => {
  const { isOpen, type, data, onClose } = useDialog();
  const isOpenDialog = isOpen && type === "equipmentDetail.edit";

  const tSchema = useTranslations("equipmentDetails.schema");
  const t = useTranslations("equipmentDetails");
  const formSchema = EquipmentDetailSchema(tSchema);

  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { isOnlyAdmin } = useCurrentStaffRole();
  const canEdit =
    isOnlyAdmin &&
    data.equipmentDetail &&
    canUpdateEquipmentDetail(data.equipmentDetail?.status);
  const [id, setId] = useState("");
  useEffect(() => {
    if (data?.equipmentDetail) {
      form.reset(data.equipmentDetail);
      setId(data.equipmentDetail.id);
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
  return (
    <DynamicDialog
      isOpen={isOpenDialog}
      title={t("form.edit.title")}
      description={t("form.edit.description")}
      className="max-w-5xl"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid lg:grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("name.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tSchema("name.placeholder")}
                      value={field.value ?? undefined}
                      onChange={field.onChange}
                      disabled={isPending || !canEdit}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("status.label")}</FormLabel>
                  <FormControl>
                    <SelectOptions
                      placeholder={tSchema("status.placeholder")}
                      onChange={field.onChange}
                      options={Object.values(EquipmentStatus).map((item) => {
                        return {
                          label: tSchema(`status.options.${item}`),
                          value: item,
                        };
                      })}
                      disabled={isPending || !canEdit}
                      defaultValue={field.value}
                      disabledValues={[
                        EquipmentStatus.WORKING,
                        EquipmentStatus.MAINTENANCE,
                      ]}
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
              name="maxOperatingHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("maxOperatingHours.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tSchema("maxOperatingHours.placeholder")}
                      value={field.value ?? undefined}
                      onChange={field.onChange}
                      disabled={isPending || !canEdit}
                      type="number"
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
                  name="maxFuelConsumption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {tSchema("maxFuelConsumption.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={tSchema(
                            "maxFuelConsumption.placeholder"
                          )}
                          value={field.value ?? undefined}
                          onChange={field.onChange}
                          disabled={isPending || !canEdit}
                          type="number"
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
              name="baseFuelPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("baseFuelPrice.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tSchema("baseFuelPrice.placeholder")}
                      value={field.value ?? undefined}
                      onChange={field.onChange}
                      disabled={isPending || !canEdit}
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="energyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("energyType.label")}</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="col-span-3">
                        <Input
                          placeholder={tSchema("energyType.placeholder")}
                          value={field.value ?? undefined}
                          onChange={field.onChange}
                          disabled={isPending || !canEdit}
                        />
                      </div>
                      <CategoriesSelect
                        error={tSchema("energyType.select.error")}
                        notFound={tSchema("energyType.select.notFound")}
                        placeholder={tSchema("energyType.select.placeholder")}
                        type="ENERGY"
                        disabled={isPending || !canEdit}
                        onChange={field.onChange}
                        valueKey="name"
                        hidden
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("location.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tSchema("location.placeholder")}
                    value={field.value ?? undefined}
                    onChange={field.onChange}
                    disabled={isPending || !canEdit}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <DynamicDialogFooter
            disabled={isPending || !canEdit}
            closeButton={false}
          />
        </form>
      </Form>
    </DynamicDialog>
  );
};
