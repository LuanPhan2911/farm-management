"use client";
import {
  DynamicDialog,
  DynamicDialogFooter,
} from "@/components/dialog/dynamic-dialog";
import { SoilSchema } from "@/schemas";
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
import { Input } from "@/components/ui/input";

import { SoilTable } from "@/types";
import { UnitsSelect } from "@/app/[locale]/(backoffice)/admin/_components/units-select";
import { edit } from "@/actions/soil";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import { useAuth } from "@clerk/nextjs";
import { EditButton } from "@/components/buttons/edit-button";

interface SoilEditButtonProps {
  data: SoilTable;
}

export const SoilEditButton = ({ data }: SoilEditButtonProps) => {
  const { isSuperAdmin } = useCurrentStaffRole();
  const { has } = useAuth();
  const isAdminOrg = has?.({ role: "org:field" }) || false;
  const canEdit = !data.confirmed || isAdminOrg || isSuperAdmin;
  return (
    <EditButton
      inltKey="soils"
      type="soil.edit"
      className="w-full"
      data={{
        soil: data,
      }}
      disabled={!canEdit}
    />
  );
};
export const SoilEditDialog = () => {
  const { isOpen, type, data, onClose } = useDialog();
  const isOpenDialog = isOpen && type === "soil.edit";

  const tSchema = useTranslations("soils.schema");
  const t = useTranslations("soils");
  const formSchema = SoilSchema(tSchema);

  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const [id, setId] = useState("");
  useEffect(() => {
    if (data?.soil) {
      form.reset(data.soil);
      setId(data.soil.id);
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
      className="max-w-4xl overflow-y-auto max-h-screen"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="ph"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("ph.label")}</FormLabel>
                <div className="flex gap-x-2">
                  <FormControl>
                    <Input
                      placeholder={tSchema("ph.placeholder")}
                      value={field.value ?? undefined}
                      onChange={field.onChange}
                      disabled={isPending}
                      type="number"
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid lg:grid-cols-2 gap-2">
            <div className="grid grid-cols-4 gap-2">
              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name="moisture.value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tSchema("moisture.label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={tSchema("moisture.placeholder")}
                          value={field.value ?? undefined}
                          onChange={field.onChange}
                          disabled={isPending}
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
                name="moisture.unitId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("moisture.unitId.label")}</FormLabel>
                    <FormControl>
                      <UnitsSelect
                        onChange={field.onChange}
                        placeholder={tSchema("moisture.unitId.placeholder")}
                        unitType={UnitType.PERCENT}
                        disabled={isPending}
                        className="w-full"
                        error={tSchema("moisture.unitId.error")}
                        notFound={tSchema("moisture.unitId.notFound")}
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
              name="nutrientUnitId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("nutrientUnitId.label")}</FormLabel>
                  <div className="flex gap-x-2">
                    <FormControl>
                      <UnitsSelect
                        onChange={field.onChange}
                        placeholder={tSchema("nutrientUnitId.placeholder")}
                        unitType={UnitType.NUTRIENT}
                        disabled={isPending}
                        className="w-full"
                        error={tSchema("nutrientUnitId.error")}
                        notFound={tSchema("nutrientUnitId.notFound")}
                        defaultValue={field.value}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-2">
            <FormField
              control={form.control}
              name="nutrientNitrogen"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("nutrientNitrogen.label")}</FormLabel>
                  <div className="flex gap-x-2">
                    <FormControl>
                      <Input
                        placeholder={tSchema("nutrientNitrogen.placeholder")}
                        value={field.value ?? undefined}
                        onChange={field.onChange}
                        disabled={isPending}
                        type="number"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nutrientPhosphorus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("nutrientPhosphorus.label")}</FormLabel>
                  <div className="flex gap-x-2">
                    <FormControl>
                      <Input
                        placeholder={tSchema("nutrientPhosphorus.placeholder")}
                        value={field.value ?? undefined}
                        onChange={field.onChange}
                        disabled={isPending}
                        type="number"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nutrientPotassium"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("nutrientPotassium.label")}</FormLabel>
                  <div className="flex gap-x-2">
                    <FormControl>
                      <Input
                        placeholder={tSchema("nutrientPotassium.placeholder")}
                        value={field.value ?? undefined}
                        onChange={field.onChange}
                        disabled={isPending}
                        type="number"
                      />
                    </FormControl>
                  </div>
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
                <div className="flex gap-x-2">
                  <FormControl>
                    <Textarea
                      value={field.value ?? undefined}
                      onChange={field.onChange}
                      disabled={isPending}
                      placeholder={tSchema("note.placeholder")}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <DynamicDialogFooter disabled={isPending} />
        </form>
      </Form>
    </DynamicDialog>
  );
};
