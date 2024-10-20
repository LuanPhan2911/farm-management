"use client";

import { Button } from "@/components/ui/button";

import { MaterialSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { edit } from "@/actions/material";
import { useParams } from "next/navigation";
import { MaterialTable } from "@/types";
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
import { MaterialType, UnitType } from "@prisma/client";
import { SelectOptions } from "@/components/form/select-options";
import { UnitsSelect } from "../../../_components/units-select";
import { UploadImage } from "@/components/form/upload-image";
import { Link } from "@/navigation";
import { Edit } from "lucide-react";

import { DynamicDialogFooter } from "@/components/dialog/dynamic-dialog";

interface MaterialEditButtonProps {
  data: MaterialTable;
  label: string;
}
export const MaterialEditButton = ({
  data,
  label,
}: MaterialEditButtonProps) => {
  return (
    <Link
      href={`/admin/materials/detail/${data.id}`}
      className="w-full"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Button variant={"edit"} size={"sm"} className="w-full">
        <Edit className="w-4 h-4 mr-2" />
        {label}
      </Button>
    </Link>
  );
};

interface MaterialEditFormProps {
  data: MaterialTable;
}
export const MaterialEditForm = ({ data }: MaterialEditFormProps) => {
  const tSchema = useTranslations("materials.schema");
  const formSchema = MaterialSchema(tSchema);

  const [isPending, startTransition] = useTransition();

  const params = useParams<{
    materialId: string;
  }>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...data,
    },
  });
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(() => {
      edit(values, params!.materialId)
        .then(({ message, ok }) => {
          if (ok) {
            toast.success(message);
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
                    label={tSchema("type.placeholder")}
                    onChange={field.onChange}
                    options={Object.values(MaterialType).map((item) => {
                      return {
                        label: tSchema(`type.options.${item}`),
                        value: item,
                      };
                    })}
                    disabled={isPending}
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
                    errorLabel={tSchema("unitId.error")}
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
