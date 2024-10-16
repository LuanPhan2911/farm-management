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
import { UnitType } from "@prisma/client";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState, useTransition } from "react";
import { DateRange } from "react-day-picker";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const CropCreateButton = () => {
  const tSchema = useTranslations("crops.schema");
  const t = useTranslations("crops");
  const formSchema = CropSchema(tSchema);
  const [isPending, startTransition] = useTransition();

  const params = useParams<{
    fieldId: string;
  }>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      fieldId: params!.fieldId,
      dateRange: {
        startDate: new Date(),
        endDate: null,
      },
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
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={"sm"} variant={"success"}>
          <Plus className="h-4 w-4 mr-2" />{" "}
          <span className="text-sm font-semibold">
            {t("form.create.label")}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl overflow-y-auto max-h-screen">
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
                  <div className="flex gap-x-2">
                    <FormControl>
                      <Input
                        value={field.value || undefined}
                        onChange={field.onChange}
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
                name="plantId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("plantId.label")}</FormLabel>
                    <div className="flex gap-x-2">
                      <FormControl>
                        <PlantsSelect
                          errorLabel={tSchema("plantId.error")}
                          label={tSchema("plantId.placeholder")}
                          notFound={tSchema("plantId.notFound")}
                          onChange={field.onChange}
                          disabled={isPending}
                          appearance={{
                            button: "lg:w-full",
                          }}
                        />
                      </FormControl>
                    </div>
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
                    <div className="flex gap-x-2">
                      <FormControl>
                        <DatePickerWithRange
                          placeholder={tSchema("dateRange.placeholder")}
                          handleChange={(dateRange: DateRange | undefined) => {
                            handleChangeDate(dateRange);
                          }}
                          date={{
                            from: field.value.startDate,
                            to: field.value.endDate || undefined,
                          }}
                          disabled={isPending}
                          className="lg:w-full"
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
                            value={field.value || undefined}
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
                          disabled={isPending}
                          className="w-full"
                          errorLabel={tSchema("estimatedYield.unitId.error")}
                          notFound={tSchema("estimatedYield.unitId.notFound")}
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
                            value={field.value || undefined}
                            onChange={field.onChange}
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
                      <FormLabel>
                        {tSchema("actualYield.unitId.label")}
                      </FormLabel>
                      <FormControl>
                        <UnitsSelect
                          onChange={field.onChange}
                          placeholder={tSchema(
                            "actualYield.unitId.placeholder"
                          )}
                          unitType={UnitType.WEIGHT}
                          disabled={isPending}
                          className="w-full"
                          errorLabel={tSchema("actualYield.unitId.error")}
                          notFound={tSchema("actualYield.unitId.notFound")}
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
                        value={field.value || undefined}
                        onChange={field.onChange}
                        disabled={isPending}
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
      </DialogContent>
    </Dialog>
  );
};
