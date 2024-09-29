"use client";
import {
  DynamicDialog,
  DynamicDialogFooter,
} from "@/components/dialog/dynamic-dialog";
import { Button } from "@/components/ui/button";
import { WeatherSchema } from "@/schemas";
import { useDialog } from "@/stores/use-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { UnitType, WeatherStatus } from "@prisma/client";
import { Edit } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState, useTransition } from "react";
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
import { WeatherTable } from "@/types";
import { UnitsSelectWithQueryClient } from "@/app/[locale]/(backoffice)/admin/_components/units-select";
import { edit } from "@/actions/weather";
import { convertNullToUndefined } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";

interface WeatherEditButtonProps {
  data: WeatherTable;
  label: string;
}

export const WeatherEditButton = ({ data, label }: WeatherEditButtonProps) => {
  const { onOpen } = useDialog();
  const { isFarmer } = useCurrentStaffRole();
  const disabled = data.confirmed && isFarmer;
  return (
    <Button
      className="w-full"
      onClick={(e) => {
        e.stopPropagation();
        onOpen("weather.edit", {
          weather: data,
        });
      }}
      size={"sm"}
      variant={"edit"}
      disabled={disabled}
    >
      <Edit className="w-4 h-4 mr-2" />
      {label}
    </Button>
  );
};
export const WeatherEditDialog = () => {
  const { isOpen, type, data, onClose } = useDialog();
  const isOpenDialog = isOpen && type === "weather.edit";

  const tSchema = useTranslations("weathers.schema");
  const t = useTranslations("weathers");
  const formSchema = WeatherSchema(tSchema);

  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const [id, setId] = useState("");
  useEffect(() => {
    if (data?.weather) {
      form.reset(data.weather);

      setId(data.weather.id);
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
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("status.label")}</FormLabel>
                <div className="flex gap-x-2">
                  <FormControl>
                    <SelectOptions
                      label="Select status"
                      onChange={field.onChange}
                      options={Object.keys(WeatherStatus).map((item) => {
                        return {
                          label: tSchema(`status.options.${item}`),
                          value: item,
                        };
                      })}
                      disabled={isPending}
                      defaultValue={field.value}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="grid grid-cols-4 gap-2">
              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name="temperature.value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tSchema("temperature.label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={tSchema("temperature.placeholder")}
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
                name="temperature.unitId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("temperature.unitId.label")}</FormLabel>
                    <FormControl>
                      <UnitsSelectWithQueryClient
                        onChange={field.onChange}
                        placeholder={tSchema("temperature.unitId.placeholder")}
                        unitType={UnitType.TEMPERATURE}
                        disabled={isPending}
                        className="w-full"
                        errorLabel={tSchema("temperature.unitId.error")}
                        notFound={tSchema("temperature.unitId.notFound")}
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
                  name="humidity.value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tSchema("humidity.label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={tSchema("humidity.placeholder")}
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
                name="humidity.unitId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("humidity.unitId.label")}</FormLabel>
                    <FormControl>
                      <UnitsSelectWithQueryClient
                        onChange={field.onChange}
                        placeholder={tSchema("humidity.unitId.placeholder")}
                        unitType={UnitType.PERCENT}
                        disabled={isPending}
                        className="w-full"
                        errorLabel={tSchema("humidity.unitId.error")}
                        notFound={tSchema("humidity.unitId.notFound")}
                        defaultValue={field.value}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="grid grid-cols-4 gap-2">
              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name="atmosphericPressure.value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {tSchema("atmosphericPressure.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={tSchema(
                            "atmosphericPressure.placeholder"
                          )}
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
                name="atmosphericPressure.unitId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {tSchema("atmosphericPressure.unitId.label")}
                    </FormLabel>
                    <FormControl>
                      <UnitsSelectWithQueryClient
                        onChange={field.onChange}
                        placeholder={tSchema(
                          "atmosphericPressure.unitId.placeholder"
                        )}
                        unitType={UnitType.ATMOSPHERICPRESSURE}
                        disabled={isPending}
                        className="w-full"
                        errorLabel={tSchema("atmosphericPressure.unitId.error")}
                        notFound={tSchema(
                          "atmosphericPressure.unitId.notFound"
                        )}
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
                  name="rainfall.value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tSchema("rainfall.label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={tSchema("rainfall.placeholder")}
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
                name="rainfall.unitId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("rainfall.unitId.label")}</FormLabel>
                    <FormControl>
                      <UnitsSelectWithQueryClient
                        onChange={field.onChange}
                        placeholder={tSchema("rainfall.unitId.placeholder")}
                        unitType={UnitType.RAINFALL}
                        disabled={isPending}
                        className="w-full"
                        errorLabel={tSchema("rainfall.unitId.error")}
                        notFound={tSchema("rainfall.unitId.notFound")}
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
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("note.label")}</FormLabel>
                <div className="flex gap-x-2">
                  <FormControl>
                    <Textarea
                      value={field.value || undefined}
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
