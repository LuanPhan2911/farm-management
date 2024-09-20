"use client";
import { DynamicDialog } from "@/components/dialog/dynamic-dialog";
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
import { DialogClose, DialogFooter } from "@/components/ui/dialog";

import { CropTable } from "@/types";
import { UnitsSelectWithQueryClient } from "@/app/[locale]/(backoffice)/admin/_components/units-select";
import { edit } from "@/actions/crop";
import { PlantsSelectWithQueryClient } from "@/app/[locale]/(backoffice)/admin/_components/plants-select";
import { DatePickerWithRange } from "@/components/form/date-picker-with-range";
import { DateRange } from "react-day-picker";
import { convertNullToUndefined } from "@/lib/utils";

interface CropEditButtonProps {
  data: CropTable;
  label: string;
}

export const CropEditButton = ({ data, label }: CropEditButtonProps) => {
  const { onOpen } = useDialog();
  return (
    <Button
      className="w-full"
      onClick={() =>
        onOpen("crop.edit", {
          crop: data,
        })
      }
      size={"sm"}
      variant={"edit"}
    >
      <Edit className="w-6 h-6 mr-2" />
      {label}
    </Button>
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
  const [id, setId] = useState("");
  useEffect(() => {
    if (data?.crop) {
      const { startDate, endDate } = data.crop;
      form.reset({
        ...convertNullToUndefined(data.crop),
        dateRange: {
          startDate: startDate,
          endDate: endDate || undefined,
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
          toast.error(t("status.failure.edit"));
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
      endDate,
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
                <div className="flex gap-x-2">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={tSchema("name.placeholder")}
                      disabled={isPending}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid lg:grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="dateRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("dateRange.label")}</FormLabel>
                  <div className="flex gap-x-2">
                    <FormControl>
                      <DatePickerWithRange
                        placeholder={tSchema("dateRange.placeholder")}
                        handleChange={handleChangeDate}
                        date={{
                          from: field.value.startDate,
                          to: field.value.endDate,
                        }}
                        disabled={isPending}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="plantId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("plantId.label")}</FormLabel>
                  <div className="flex gap-x-2">
                    <FormControl>
                      <PlantsSelectWithQueryClient
                        errorLabel={tSchema("plantId.error")}
                        label={tSchema("plantId.placeholder")}
                        notFound={tSchema("plantId.notFound")}
                        onChange={field.onChange}
                        disabled={isPending}
                        defaultValue={field.value}
                      />
                    </FormControl>
                  </div>
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
                          {...field}
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
                name="estimatedYield.unitId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {tSchema("estimatedYield.unitId.label")}
                    </FormLabel>
                    <FormControl>
                      <UnitsSelectWithQueryClient
                        onChange={field.onChange}
                        placeholder={tSchema(
                          "estimatedYield.unitId.placeholder"
                        )}
                        unitType={UnitType.WEIGHT}
                        disabled={isPending}
                        className="w-full"
                        errorLabel={tSchema("estimatedYield.unitId.error")}
                        notFound={tSchema("estimatedYield.unitId.notFound")}
                        defaultValue={field.value}
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
                          {...field}
                          placeholder={tSchema("actualYield.placeholder")}
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
                name="actualYield.unitId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("actualYield.unitId.label")}</FormLabel>
                    <FormControl>
                      <UnitsSelectWithQueryClient
                        onChange={field.onChange}
                        placeholder={tSchema("actualYield.unitId.placeholder")}
                        unitType={UnitType.WEIGHT}
                        disabled={isPending}
                        className="w-full"
                        errorLabel={tSchema("actualYield.unitId.error")}
                        notFound={tSchema("actualYield.unitId.notFound")}
                        defaultValue={field.value}
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
                <div className="flex gap-x-2">
                  <FormControl>
                    <Input
                      placeholder={tSchema("status.placeholder")}
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              Submit
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DynamicDialog>
  );
};
