"use client";

import { create } from "@/actions/plant";
import { Button } from "@/components/ui/button";

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
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { CategoriesSelectWithQueryClient } from "../../../_components/categories-select";
import { CategoryType, FertilizerType, Season, UnitType } from "@prisma/client";
import { SelectOptions } from "@/components/form/select-options";
import { UnitsSelectWithQueryClient } from "../../../_components/units-select";
import { Link, useRouter } from "@/navigation";
import { UploadImage } from "@/components/form/upload-image";

export const PlantCreateButton = () => {
  const t = useTranslations("plants.form");
  return (
    <Link href={"/admin/plants/create"}>
      <Button size={"sm"} variant={"success"}>
        <Plus className="h-6 w-6 mr-2" />{" "}
        <span className="text-sm font-semibold">{t("create.label")}</span>
      </Button>
    </Link>
  );
};
export const PlantCreateForm = () => {
  const tSchema = useTranslations("plants.schema");
  const t = useTranslations("plants");
  const router = useRouter();
  const formSchema = PlantSchema(tSchema);
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(() => {
      create(values)
        .then(({ message, ok }) => {
          if (ok) {
            form.reset();
            toast.success(message);
            router.push("/admin/plants");
          } else {
            toast.error(message);
          }
        })
        .catch((error: Error) => {
          toast.error(t("status.failure.create"));
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
                    {...field}
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
                  <CategoriesSelectWithQueryClient
                    errorLabel={tSchema("categoryId.error")}
                    notFound={tSchema("categoryId.notFound")}
                    onChange={field.onChange}
                    type={CategoryType.PLANT}
                    placeholder={tSchema("categoryId.placeholder")}
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
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
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
                      <UnitsSelectWithQueryClient
                        onChange={field.onChange}
                        placeholder={tSchema(
                          "idealTemperature.unitId.placeholder"
                        )}
                        unitType={UnitType.TEMPERATURE}
                        disabled={isPending}
                        className="w-full"
                        errorLabel={tSchema("idealTemperature.unitId.error")}
                        notFound={tSchema("idealTemperature.unitId.notFound")}
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
                      <UnitsSelectWithQueryClient
                        onChange={field.onChange}
                        placeholder={tSchema(
                          "idealHumidity.unitId.placeholder"
                        )}
                        unitType={UnitType.PERCENT}
                        disabled={isPending}
                        className="w-full"
                        errorLabel={tSchema("idealHumidity.unitId.error")}
                        notFound={tSchema("idealHumidity.unitId.notFound")}
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
                      <UnitsSelectWithQueryClient
                        onChange={field.onChange}
                        placeholder={tSchema(
                          "waterRequirement.unitId.placeholder"
                        )}
                        unitType={UnitType.RAINFALL}
                        disabled={isPending}
                        className="w-full"
                        errorLabel={tSchema("waterRequirement.unitId.error")}
                        notFound={tSchema("waterRequirement.unitId.notFound")}
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
          name="growthDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tSchema("growthDuration.label")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={tSchema("growthDuration.placeholder")}
                  {...field}
                  disabled={isPending}
                  type="number"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <div className="flex gap-x-2 justify-center">
          <Button type="submit" disabled={isPending}>
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};
