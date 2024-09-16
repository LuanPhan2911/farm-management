"use client";

import { create } from "@/actions/equipment";
import { UnitsSelectWithQueryClient } from "@/app/[locale]/(backoffice)/admin/_components/units-select";
import { DatePicker } from "@/components/form/date-picker";
import { SelectOptions } from "@/components/form/select-options";
import { UploadImage } from "@/components/form/upload-image";
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
import { Textarea } from "@/components/ui/textarea";
import { Link, useRouter } from "@/navigation";
import { EquipmentSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { EquipmentType, UnitType } from "@prisma/client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const EquipmentCreateButton = () => {
  const t = useTranslations("equipments.form");
  return (
    <Link href={"/admin/equipments/create"}>
      <Button variant={"success"} size={"sm"}>
        <Plus className="mr-2" />
        {t("create.label")}
      </Button>
    </Link>
  );
};

export const EquipmentCreateForm = () => {
  const tSchema = useTranslations("equipments.schema");
  const formSchema = EquipmentSchema(tSchema);
  const t = useTranslations("equipments");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(() => {
      create(values)
        .then(({ message, ok }) => {
          if (ok) {
            toast.success(message);
            router.push("/admin/equipments");
          } else {
            toast.error(message);
          }
        })
        .catch((error) => {
          toast.error(t("status.failure.create"));
        });
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-5xl"
      >
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
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tSchema("brand.label")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={tSchema("brand.placeholder")}
                  {...field}
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
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("type.label")}</FormLabel>
                <FormControl>
                  <SelectOptions
                    label={tSchema("type.placeholder")}
                    onChange={field.onChange}
                    options={Object.values(EquipmentType).map((item) => {
                      return {
                        label: tSchema(`type.options.${item}`),
                        value: item,
                      };
                    })}
                    disabled={isPending}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="purchaseDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("purchaseDate.label")}</FormLabel>
                <FormControl>
                  <DatePicker
                    onChange={field.onChange}
                    date={field.value}
                    disabled={isPending}
                    placeholder={tSchema("purchaseDate.placeholder")}
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
              name="purchasePrice.value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("purchasePrice.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tSchema("purchasePrice.placeholder")}
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
            name="purchasePrice.unitId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("purchasePrice.unitId.label")}</FormLabel>
                <FormControl>
                  <UnitsSelectWithQueryClient
                    onChange={field.onChange}
                    placeholder={tSchema("purchasePrice.unitId.placeholder")}
                    unitType={UnitType.MONEY}
                    disabled={isPending}
                    className="w-full"
                    errorLabel={tSchema("purchasePrice.unitId.error")}
                    notFound={tSchema("purchasePrice.unitId.notFound")}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tSchema("description.label")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={tSchema("description.placeholder")}
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
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tSchema("status.label")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={tSchema("status.placeholder")}
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
          name="maintenanceSchedule"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tSchema("maintenanceSchedule.label")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={tSchema("maintenanceSchedule.placeholder")}
                  {...field}
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
            name="energyType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("energyType.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tSchema("energyType.placeholder")}
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
            name="fuelConsumption"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("fuelConsumption.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tSchema("fuelConsumption.placeholder")}
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
          name="operatingHours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tSchema("operatingHours.label")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={tSchema("operatingHours.placeholder")}
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
                <UploadImage onChange={field.onChange} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          Submit
        </Button>
      </form>
    </Form>
  );
};
