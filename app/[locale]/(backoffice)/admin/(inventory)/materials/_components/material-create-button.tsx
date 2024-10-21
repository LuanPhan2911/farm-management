"use client";

import { create } from "@/actions/material";
import { UnitsSelect } from "@/app/[locale]/(backoffice)/admin/_components/units-select";
import { DynamicDialogFooter } from "@/components/dialog/dynamic-dialog";
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
import { MaterialSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { MaterialType, UnitType } from "@prisma/client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const MaterialCreateButton = () => {
  const t = useTranslations("materials.form");
  return (
    <Link href={"/admin/materials/create"}>
      <Button variant={"success"} size={"sm"}>
        <Plus className="mr-2" />
        {t("create.label")}
      </Button>
    </Link>
  );
};

export const MaterialCreateForm = () => {
  const tSchema = useTranslations("materials.schema");
  const formSchema = MaterialSchema(tSchema);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "OTHER",
    },
  });
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(() => {
      create(values)
        .then(({ message, ok }) => {
          if (ok) {
            toast.success(message);
            router.push("/admin/materials");
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
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tSchema("imageUrl.label")}</FormLabel>
              <FormControl>
                <UploadImage
                  onChange={field.onChange}
                  disabled={isPending}
                  defaultValue={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                    disabled={isPending}
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
              name="quantityInStock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("quantityInStock.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tSchema("quantityInStock.placeholder")}
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
            name="unitId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("unitId.label")}</FormLabel>
                <FormControl>
                  <UnitsSelect
                    onChange={field.onChange}
                    placeholder={tSchema("unitId.placeholder")}
                    unitType={UnitType.QUANTITY}
                    disabled={isPending}
                    className="w-full"
                    error={tSchema("unitId.error")}
                    notFound={tSchema("unitId.notFound")}
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
                  value={field.value || undefined}
                  onChange={field.onChange}
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
