"use client";

import { create } from "@/actions/equipment-detail";
import { CategoriesSelect } from "@/app/[locale]/(backoffice)/admin/_components/categories-select";
import { UnitsSelect } from "@/app/[locale]/(backoffice)/admin/_components/units-select";
import { CreateButton } from "@/components/buttons/create-button";
import { DynamicDialogFooter } from "@/components/dialog/dynamic-dialog";
import { SelectOptions } from "@/components/form/select-options";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import { EquipmentDetailSchema } from "@/schemas";
import { EquipmentTable } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { EquipmentStatus, UnitType } from "@prisma/client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface EquipmentDetailCreateButtonProps {
  data: EquipmentTable;
}
export const EquipmentDetailCreateButton = ({
  data,
}: EquipmentDetailCreateButtonProps) => {
  const t = useTranslations("equipmentDetails.form");
  const [isOpen, setOpen] = useState(false);
  const { isOnlyAdmin: canCreate } = useCurrentStaffRole();
  return (
    <CreateButton
      label={t("create.label")}
      isOpen={isOpen}
      setOpen={setOpen}
      disabled={!canCreate}
      className="max-w-5xl"
    >
      <EquipmentDetailCreateForm data={data} onCreated={() => setOpen(false)} />
    </CreateButton>
  );
};

interface EquipmentCreateFormProps {
  onCreated?: () => void;
  data: EquipmentTable;
}
export const EquipmentDetailCreateForm = ({
  onCreated,
  data,
}: EquipmentCreateFormProps) => {
  const tSchema = useTranslations("equipmentDetails.schema");
  const formSchema = EquipmentDetailSchema(tSchema);
  const [isPending, startTransition] = useTransition();
  const params = useParams<{
    equipmentId: string;
  }>()!;

  const { isOnlyAdmin: canCreate } = useCurrentStaffRole();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      equipmentId: params.equipmentId,
      name: `${data.name} (${data._count.equipmentDetails})`,
      status: "AVAILABLE",
      maxOperatingHours: 100,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(() => {
      create(values)
        .then(({ message, ok }) => {
          if (ok) {
            toast.success(message);
            onCreated?.();
          } else {
            toast.error(message);
          }
        })
        .catch((error) => {
          toast.error("Internal error");
        });
    });
  };
  return (
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
                    disabled={isPending || !canCreate}
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
                    disabled={isPending || !canCreate}
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
                    disabled={isPending || !canCreate}
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
                    <FormLabel>{tSchema("maxFuelConsumption.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={tSchema("maxFuelConsumption.placeholder")}
                        value={field.value ?? undefined}
                        onChange={field.onChange}
                        disabled={isPending || !canCreate}
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
                      disabled={isPending || !canCreate}
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
                    disabled={isPending || !canCreate}
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
                        disabled={isPending || !canCreate}
                      />
                    </div>
                    <CategoriesSelect
                      error={tSchema("energyType.select.error")}
                      notFound={tSchema("energyType.select.notFound")}
                      placeholder={tSchema("energyType.select.placeholder")}
                      type="ENERGY"
                      disabled={isPending || !canCreate}
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
                  disabled={isPending || !canCreate}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <DynamicDialogFooter
          disabled={isPending || !canCreate}
          closeButton={false}
        />
      </form>
    </Form>
  );
};
