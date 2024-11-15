"use client";
import {
  DynamicDialog,
  DynamicDialogFooter,
} from "@/components/dialog/dynamic-dialog";
import { MaterialUsageSchema, MaterialUsageUpdateSchema } from "@/schemas";
import { useDialog } from "@/stores/use-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { UnitType } from "@prisma/client";
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
import { edit } from "@/actions/material-usage";
import { Input } from "@/components/ui/input";
import { MaterialUsageTable } from "@/types";
import { UnitsSelect } from "@/app/[locale]/(backoffice)/admin/_components/units-select";
import { EditButton } from "@/components/buttons/edit-button";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";

interface MaterialUsageEditButtonProps {
  data: MaterialUsageTable;
  disabled?: boolean;
}

export const MaterialUsageEditButton = ({
  data,
  disabled,
}: MaterialUsageEditButtonProps) => {
  return (
    <EditButton
      inltKey="materialUsages"
      type="materialUsage.edit"
      className="w-full"
      data={{
        materialUsage: data,
      }}
      disabled={disabled}
    />
  );
};
export const MaterialUsageEditDialog = () => {
  const { isOpen, type, data, onClose } = useDialog();
  const isOpenDialog = isOpen && type === "materialUsage.edit";

  const tSchema = useTranslations("materialUsages.schema");
  const t = useTranslations("materialUsages.form");
  const formSchema = MaterialUsageUpdateSchema(tSchema);

  const [maxQuantityUsed, setMaxQuantityUsed] = useState<number | undefined>(
    undefined
  );
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { isOnlyAdmin } = useCurrentStaffRole();
  const [id, setId] = useState("");
  useEffect(() => {
    if (data?.materialUsage) {
      const { activityId, materialId, quantityUsed, unitId, material } =
        data.materialUsage;
      const actualPrice = data.materialUsage.actualPrice || material.basePrice;

      form.reset({
        activityId,
        actualPrice,
        quantityUsed,
        unitId,
      });
      setMaxQuantityUsed(quantityUsed + material.quantityInStock);
      setId(data.materialUsage.id);
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

  const canEdit = isOnlyAdmin && data.materialUsage?.activityId === null;
  return (
    <DynamicDialog
      isOpen={isOpenDialog}
      title={t("edit.title")}
      description={t("edit.description")}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-4 gap-2">
            <div className="col-span-3">
              <FormField
                control={form.control}
                name="quantityUsed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("quantityUsed.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={tSchema("quantityUsed.placeholder")}
                        value={field.value ?? undefined}
                        onChange={field.onChange}
                        disabled={isPending || !canEdit}
                        type="number"
                        min={1}
                        max={maxQuantityUsed}
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
                      unitType={UnitType.QUANTITY}
                      disabled={true}
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
          <FormField
            control={form.control}
            name="actualPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("actualPrice.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tSchema("actualPrice.placeholder")}
                    value={field.value ?? undefined}
                    onChange={field.onChange}
                    disabled={isPending || !canEdit}
                    type="number"
                    min={1}
                    max={10_000_000}
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
