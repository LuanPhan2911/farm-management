"use client";

import { edit } from "@/actions/plant";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PlantSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { CategoriesSelect } from "../../../_components/categories-select";
import { CategoryType, FertilizerType, Season, UnitType } from "@prisma/client";
import { SelectOptions } from "@/components/form/select-options";
import { UnitsSelect } from "../../../_components/units-select";
import { PlantTable } from "@/types";
import { UploadImage } from "@/components/form/upload-image";
import { convertNullToUndefined } from "@/lib/utils";
import { DynamicDialogFooter } from "@/components/dialog/dynamic-dialog";

interface PlantCreateFormProps {
  data: PlantTable;
}
export const PlantEditForm = ({ data }: PlantCreateFormProps) => {
  const tSchema = useTranslations("plants.schema");
  const t = useTranslations("plants");

  const formSchema = PlantSchema(tSchema);
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...data,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(() => {
      edit(values, data.id)
        .then(({ message, ok }) => {
          if (ok) {
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-4xl"
      >
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
                    value={field.value || undefined}
                    onChange={field.onChange}
                    disabled={isPending}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("categoryId.label")}</FormLabel>
                <FormControl>
                  <CategoriesSelect
                    errorLabel={tSchema("categoryId.error")}
                    notFound={tSchema("categoryId.notFound")}
                    onChange={field.onChange}
                    type={CategoryType.PLANT}
                    placeholder={tSchema("categoryId.placeholder")}
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
          name="growthDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tSchema("growthDuration.label")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={tSchema("growthDuration.placeholder")}
                  value={field.value || undefined}
                  onChange={field.onChange}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid lg:grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="fertilizerType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("fertilizerType.label")}</FormLabel>
                <FormControl>
                  <SelectOptions
                    label={tSchema("fertilizerType.placeholder")}
                    onChange={field.onChange}
                    disabled={isPending}
                    options={Object.values(FertilizerType).map((item) => {
                      return {
                        label: tSchema(`fertilizerType.options.${item}`),
                        value: item,
                      };
                    })}
                    defaultValue={field.value}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="season"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("season.label")}</FormLabel>
                <FormControl>
                  <SelectOptions
                    label={tSchema("season.placeholder")}
                    onChange={field.onChange}
                    disabled={isPending}
                    options={Object.values(Season).map((item) => {
                      return {
                        label: tSchema(`season.options.${item}`),
                        value: item,
                      };
                    })}
                    defaultValue={field.value}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid lg:grid-cols-3 gap-2">
          <div className="grid grid-cols-5 gap-2">
            <div className="col-span-3">
              <FormField
                control={form.control}
                name="idealTemperature.value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("idealTemperature.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={tSchema("idealTemperature.placeholder")}
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
            <div className="col-span-2">
              <FormField
                control={form.control}
                name="idealTemperature.unitId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {tSchema("idealTemperature.unitId.label")}
                    </FormLabel>
                    <FormControl>
                      <UnitsSelect
                        onChange={field.onChange}
                        placeholder={tSchema(
                          "idealTemperature.unitId.placeholder"
                        )}
                        unitType={UnitType.TEMPERATURE}
                        disabled={isPending}
                        className="w-full"
                        errorLabel={tSchema("idealTemperature.unitId.error")}
                        notFound={tSchema("idealTemperature.unitId.notFound")}
                        defaultValue={field.value}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-5 gap-2">
            <div className="col-span-3">
              <FormField
                control={form.control}
                name="idealHumidity.value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("idealHumidity.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={tSchema("idealHumidity.placeholder")}
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
            <div className="col-span-2">
              <FormField
                control={form.control}
                name="idealHumidity.unitId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {tSchema("idealHumidity.unitId.label")}
                    </FormLabel>
                    <FormControl>
                      <UnitsSelect
                        onChange={field.onChange}
                        placeholder={tSchema(
                          "idealHumidity.unitId.placeholder"
                        )}
                        unitType={UnitType.PERCENT}
                        disabled={isPending}
                        className="w-full"
                        errorLabel={tSchema("idealHumidity.unitId.error")}
                        notFound={tSchema("idealHumidity.unitId.notFound")}
                        defaultValue={field.value}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-5 gap-2">
            <div className="col-span-3">
              <FormField
                control={form.control}
                name="waterRequirement.value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("waterRequirement.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={tSchema("waterRequirement.placeholder")}
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
            <div className="col-span-2">
              <FormField
                control={form.control}
                name="waterRequirement.unitId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {tSchema("waterRequirement.unitId.label")}
                    </FormLabel>
                    <FormControl>
                      <UnitsSelect
                        onChange={field.onChange}
                        placeholder={tSchema(
                          "waterRequirement.unitId.placeholder"
                        )}
                        unitType={UnitType.RAINFALL}
                        disabled={isPending}
                        className="w-full"
                        errorLabel={tSchema("waterRequirement.unitId.error")}
                        notFound={tSchema("waterRequirement.unitId.notFound")}
                        defaultValue={field.value}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tSchema("imageUrl.label")}</FormLabel>
              <FormControl>
                <UploadImage
                  onChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DynamicDialogFooter disabled={isPending} closeButton={false} />
      </form>
    </Form>
  );
};
