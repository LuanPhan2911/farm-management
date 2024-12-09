"use client";

import { create } from "@/actions/crop";
import { PlantsSelect } from "@/app/[locale]/(backoffice)/admin/_components/plants-select";
import { UnitsSelect } from "@/app/[locale]/(backoffice)/admin/_components/units-select";
import { DynamicDialogFooter } from "@/components/dialog/dynamic-dialog";
import { DatePickerWithRange } from "@/components/form/date-picker-with-range";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CropSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { CropStatus, UnitType } from "@prisma/client";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { DateRange } from "react-day-picker";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FieldsSelect } from "../../_components/fields-select";
import { SelectOptions } from "@/components/form/select-options";
import { ManagePermission } from "@/types";

interface CropCreateButtonProps extends ManagePermission {}
export const CropCreateButton = ({ canCreate }: CropCreateButtonProps) => {
  const tSchema = useTranslations("crops.schema");
  const t = useTranslations("crops");
  const formSchema = CropSchema(tSchema);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      startDate: new Date(),
      endDate: null,
      status: "NEW",
    },
  });
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
  const endDate = form.watch("endDate");

  const disabled = isPending || !canCreate;
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={"sm"} variant={"success"} disabled={!canCreate}>
          <Plus className="h-4 w-4 mr-2" />{" "}
          <span className="text-sm font-semibold">
            {t("form.create.label")}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl overflow-y-auto max-h-screen">
        <DialogHeader>
          <DialogTitle>{t("form.create.title")}</DialogTitle>
          <DialogDescription>{t("form.create.description")}</DialogDescription>
        </DialogHeader>

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
                      disabled={disabled}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid lg:grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("startDate.label")}</FormLabel>
                    <FormControl>
                      <DatePickerWithRange
                        placeholder={tSchema("startDate.placeholder")}
                        handleChange={(dateRange: DateRange | undefined) => {
                          if (!dateRange || !dateRange.from) {
                            return;
                          }
                          form.setValue("startDate", dateRange.from);
                          form.setValue("endDate", dateRange.to);
                        }}
                        date={{
                          from: field.value,
                          to: endDate || undefined,
                        }}
                        disabled={disabled}
                        className="lg:w-full"
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
                        options={Object.values(CropStatus).map((item) => {
                          return {
                            label: tSchema(`status.options.${item}`),
                            value: item,
                          };
                        })}
                        placeholder={tSchema("status.placeholder")}
                        defaultValue={field.value}
                        onChange={field.onChange}
                        disabled={disabled}
                        disabledValues={[
                          CropStatus.FINISH,
                          CropStatus.HARVEST,
                          CropStatus.MATURE,
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
                        disabled={disabled}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fieldId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("fieldId.label")}</FormLabel>

                    <FormControl>
                      <FieldsSelect
                        error={tSchema("fieldId.error")}
                        placeholder={tSchema("fieldId.placeholder")}
                        notFound={tSchema("fieldId.notFound")}
                        onChange={field.onChange}
                        disabled={disabled}
                        isCreateCrop
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
                name="unitId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("unitId.label")}</FormLabel>
                    <FormControl>
                      <UnitsSelect
                        onChange={field.onChange}
                        placeholder={tSchema("unitId.placeholder")}
                        unitType={UnitType.WEIGHT}
                        disabled={disabled}
                        error={tSchema("unitId.error")}
                        notFound={tSchema("unitId.notFound")}
                        defaultValue={field.value}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="estimatedYield"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("estimatedYield.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={tSchema("estimatedYield.placeholder")}
                        value={field.value ?? undefined}
                        onChange={field.onChange}
                        disabled={disabled}
                        type="number"
                        min={0}
                        max={1_000_000_000}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="actualYield"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("actualYield.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={tSchema("actualYield.placeholder")}
                        value={field.value ?? undefined}
                        onChange={field.onChange}
                        disabled={disabled}
                        type="number"
                        min={0}
                        max={1_000_000_000}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DynamicDialogFooter disabled={disabled} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
