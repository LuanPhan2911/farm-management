"use client";

import { create } from "@/actions/material";
import { UnitsSelect } from "@/app/[locale]/(backoffice)/admin/_components/units-select";
import { LinkButton } from "@/components/buttons/link-button";
import { DynamicDialogFooter } from "@/components/dialog/dynamic-dialog";
import { SelectOptions } from "@/components/form/select-options";
import { UploadImage } from "@/components/form/upload-image";

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
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import { MaterialSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { MaterialType, UnitType } from "@prisma/client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { MaterialNameSelect } from "../../../_components/material-name-select";
import { useRouterWithRole } from "@/hooks/use-router-with-role";

export const MaterialCreateButton = () => {
  const t = useTranslations("materials.form");
  const { isOnlyAdmin: canCreate } = useCurrentStaffRole();
  return (
    <LinkButton
      href="materials/create"
      label={t("create.label")}
      icon={Plus}
      variant={"success"}
      disabled={!canCreate}
    />
  );
};

export const MaterialCreateForm = () => {
  const tSchema = useTranslations("materials.schema");
  const formSchema = MaterialSchema(tSchema);
  const [isPending, startTransition] = useTransition();
  const router = useRouterWithRole();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "OTHER",
      quantityInStock: 1,
    },
  });
  const { isSuperAdmin: canCreate } = useCurrentStaffRole();
  const materialType = form.watch("type");
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(() => {
      create(values)
        .then(({ message, ok }) => {
          if (ok) {
            toast.success(message);
            router.push("materials");
          } else {
            toast.error(message);
          }
        })
        .catch((error) => {
          toast.error("Internal error");
        });
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-5xl"
      >
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="col-span-1 space-y-4">
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
                      options={Object.values(MaterialType).map((item) => {
                        return {
                          label: tSchema(`type.options.${item}`),
                          value: item,
                        };
                      })}
                      disabled={isPending || !canCreate}
                      defaultValue={field.value}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("name.select.label")}</FormLabel>
                  <FormControl>
                    <MaterialNameSelect
                      onChange={field.onChange}
                      type={materialType}
                      error={tSchema("name.select.error")}
                      notFound={tSchema("name.select.notFound")}
                      placeholder={tSchema("name.select.placeholder")}
                      appearance={{
                        button: "lg:w-full h-12",
                        content: "lg:w-[350px]",
                      }}
                      disabled={isPending || !canCreate}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-1 space-y-4">
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
                      disabled={isPending || !canCreate}
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
                  name="quantityInStock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tSchema("quantityInStock.label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={tSchema("quantityInStock.placeholder")}
                          value={field.value ?? undefined}
                          onChange={field.onChange}
                          disabled={isPending || !canCreate}
                          type="number"
                          min={1}
                          max={1000}
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
                        disabled={isPending || !canCreate}
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
              name="basePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("basePrice.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tSchema("basePrice.placeholder")}
                      value={field.value ?? undefined}
                      onChange={field.onChange}
                      disabled={isPending || !canCreate}
                      type="number"
                      min={0}
                      max={10_000_000}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("description.label")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={tSchema("description.placeholder")}
                      value={field.value ?? undefined}
                      onChange={field.onChange}
                      disabled={isPending || !canCreate}
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
                      disabled={isPending || !canCreate}
                      defaultValue={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <DynamicDialogFooter
          disabled={isPending || !canCreate}
          closeButton={false}
        />
      </form>
    </Form>
  );
};
