"use client";
import {
  DynamicDialog,
  DynamicDialogFooter,
} from "@/components/dialog/dynamic-dialog";
import { Button } from "@/components/ui/button";
import { CropSchema } from "@/schemas";
import { useDialog } from "@/stores/use-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { UnitType } from "@prisma/client";
import { Edit } from "lucide-react";
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
import { Input } from "@/components/ui/input";

import { CropTable } from "@/types";
import { UnitsSelect } from "@/app/[locale]/(backoffice)/admin/_components/units-select";
import { edit } from "@/actions/crop";
import { PlantsSelect } from "@/app/[locale]/(backoffice)/admin/_components/plants-select";
import { DatePickerWithRange } from "@/components/form/date-picker-with-range";
import { DateRange } from "react-day-picker";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import { EditButton } from "@/components/buttons/edit-button";

interface CropEditButtonProps {
  data: CropTable;
}

export const CropEditButton = ({ data }: CropEditButtonProps) => {
  const { isSuperAdmin: canEdit } = useCurrentStaffRole();
  return (
    <EditButton
      inltKey="crops"
      type="crop.edit"
      className="w-full"
      data={{
        crop: data,
      }}
      disabled={!canEdit}
    />
  );
};
export const CropEditDialog = () => {
  const { isOpen, type, data, onClose } = useDialog();
  const isOpenDialog = isOpen && type === "crop.edit";

  const tSchema = useTranslations("crops.schema");
  const t = useTranslations("crops");
  const formSchema = CropSchema(tSchema);

  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const { isSuperAdmin: canEdit } = useCurrentStaffRole();
  const [id, setId] = useState("");
  useEffect(() => {
    if (data?.crop) {
      const { startDate, endDate } = data.crop;

      form.reset({
        ...data.crop,
        dateRange: {
          startDate,
          endDate,
        },
      });
      setId(data.crop.id);
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
  const handleChangeDate = (dateRange: DateRange | undefined) => {
    if (!dateRange || !dateRange.from) {
      return;
    }
    const { from: startDate, to: endDate } = dateRange;
    form.setValue("dateRange", {
      startDate,
      endDate: endDate || null,
    });
  };
  return (
    <DynamicDialog
      isOpen={isOpenDialog}
      title={t("form.edit.title")}
      description={t("form.edit.description")}
      className="max-w-4xl overflow-y-auto max-h-screen"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("name.label")}</FormLabel>

                <FormControl>
                  <Input
                    value={field.value ?? undefined}
                    onChange={field.onChange}
                    placeholder={tSchema("name.placeholder")}
                    disabled={isPending || !canEdit}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid lg:grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="plantId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("plantId.label")}</FormLabel>

                  <FormControl>
                    <PlantsSelect
                      error={tSchema("plantId.error")}
                      placeholder={tSchema("plantId.placeholder")}
                      notFound={tSchema("plantId.notFound")}
                      onChange={field.onChange}
                      disabled={isPending || !canEdit}
                      defaultValue={field.value}
                      appearance={{
                        button: "lg:w-full",
                      }}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("dateRange.label")}</FormLabel>

                  <FormControl>
                    <DatePickerWithRange
                      placeholder={tSchema("dateRange.placeholder")}
                      handleChange={handleChangeDate}
                      date={{
                        from: field.value.startDate,
                        to: field.value.endDate || undefined,
                      }}
                      disabled={isPending || !canEdit}
                      className="lg:w-full"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid lg:grid-cols-2 gap-2">
            <div className="grid grid-cols-4 gap-2">
              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name="estimatedYield.value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tSchema("estimatedYield.label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={tSchema("estimatedYield.placeholder")}
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
                name="estimatedYield.unitId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {tSchema("estimatedYield.unitId.label")}
                    </FormLabel>
                    <FormControl>
                      <UnitsSelect
                        onChange={field.onChange}
                        placeholder={tSchema(
                          "estimatedYield.unitId.placeholder"
                        )}
                        unitType={UnitType.WEIGHT}
                        disabled={isPending || !canEdit}
                        className="w-full"
                        error={tSchema("estimatedYield.unitId.error")}
                        notFound={tSchema("estimatedYield.unitId.notFound")}
                        defaultValue={field.value ?? undefined}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name="actualYield.value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tSchema("actualYield.label")}</FormLabel>
                      <FormControl>
                        <Input
                          value={field.value ?? undefined}
                          onChange={field.onChange}
                          placeholder={tSchema("actualYield.placeholder")}
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
                name="actualYield.unitId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("actualYield.unitId.label")}</FormLabel>
                    <FormControl>
                      <UnitsSelect
                        onChange={field.onChange}
                        placeholder={tSchema("actualYield.unitId.placeholder")}
                        unitType={UnitType.WEIGHT}
                        disabled={isPending || !canEdit}
                        className="w-full"
                        error={tSchema("actualYield.unitId.error")}
                        notFound={tSchema("actualYield.unitId.notFound")}
                        defaultValue={field.value ?? undefined}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("status.label")}</FormLabel>

                <FormControl>
                  <Input
                    placeholder={tSchema("status.placeholder")}
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
