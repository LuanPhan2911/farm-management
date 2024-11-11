"use client";
import {
  DynamicDialog,
  DynamicDialogFooter,
} from "@/components/dialog/dynamic-dialog";
import { FertilizerSchema } from "@/schemas";
import { useDialog } from "@/stores/use-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { FertilizerType, Frequency, UnitType } from "@prisma/client";
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
import { SelectOptions } from "@/components/form/select-options";
import { FertilizerTable } from "@/types";
import { UnitsSelect } from "@/app/[locale]/(backoffice)/admin/_components/units-select";
import { edit } from "@/actions/fertilizer";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import { EditButton } from "@/components/buttons/edit-button";

interface FertilizerEditButtonProps {
  data: FertilizerTable;
}

export const FertilizerEditButton = ({ data }: FertilizerEditButtonProps) => {
  const { isOnlyAdmin: canEdit } = useCurrentStaffRole();
  return (
    <EditButton
      inltKey="fertilizers"
      type="fertilizer.edit"
      className="w-full"
      data={{
        fertilizer: data,
      }}
      disabled={!canEdit}
    />
  );
};
export const FertilizerEditDialog = () => {
  const { isOpen, type, data, onClose } = useDialog();
  const isOpenDialog = isOpen && type === "fertilizer.edit";

  const { isOnlyAdmin: canEdit } = useCurrentStaffRole();
  const tSchema = useTranslations("fertilizers.schema");
  const t = useTranslations("fertilizers");
  const formSchema = FertilizerSchema(tSchema);

  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const [id, setId] = useState("");
  useEffect(() => {
    if (data?.fertilizer) {
      form.reset(data.fertilizer);
      setId(data.fertilizer.id);
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
      className="max-w-6xl"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
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
              name="manufacturer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("manufacturer.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tSchema("manufacturer.placeholder")}
                      value={field.value ?? undefined}
                      onChange={field.onChange}
                      disabled={isPending || !canEdit}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-2">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("type.label")}</FormLabel>
                  <FormControl>
                    <SelectOptions
                      placeholder={tSchema("type.placeholder")}
                      onChange={field.onChange}
                      options={Object.keys(FertilizerType).map((item) => {
                        return {
                          label: tSchema(`type.options.${item}`),
                          value: item,
                        };
                      })}
                      defaultValue={field.value}
                      disabled={isPending || !canEdit}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="frequencyOfUse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("frequencyOfUse.label")}</FormLabel>
                  <FormControl>
                    <SelectOptions
                      placeholder={tSchema("frequencyOfUse.placeholder")}
                      onChange={field.onChange}
                      options={Object.keys(Frequency).map((item) => {
                        return {
                          label: tSchema(`frequencyOfUse.options.${item}`),
                          value: item,
                        };
                      })}
                      defaultValue={field.value}
                      disabled={isPending || !canEdit}
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
                  name="recommendedDosage.value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {tSchema("recommendedDosage.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={tSchema("recommendedDosage.placeholder")}
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
                name="recommendedDosage.unitId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {tSchema("recommendedDosage.unitId.label")}
                    </FormLabel>
                    <FormControl>
                      <UnitsSelect
                        onChange={field.onChange}
                        placeholder={tSchema(
                          "recommendedDosage.unitId.placeholder"
                        )}
                        unitType={UnitType.VOLUME}
                        disabled={isPending || !canEdit}
                        className="w-full"
                        error={tSchema("recommendedDosage.unitId.error")}
                        notFound={tSchema("recommendedDosage.unitId.notFound")}
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
              name="nutrientOfNPK"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("nutrientOfNPK.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tSchema("nutrientOfNPK.placeholder")}
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
              name="applicationMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("applicationMethod.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tSchema("applicationMethod.placeholder")}
                      value={field.value ?? undefined}
                      onChange={field.onChange}
                      disabled={isPending || !canEdit}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="composition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("composition.label")}</FormLabel>
                <div className="flex gap-x-2">
                  <FormControl>
                    <Textarea
                      value={field.value ?? undefined}
                      onChange={field.onChange}
                      disabled={isPending || !canEdit}
                      placeholder={tSchema("composition.placeholder")}
                    />
                  </FormControl>
                </div>
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
