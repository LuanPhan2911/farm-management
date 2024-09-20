"use client";
import { DynamicDialog } from "@/components/dialog/dynamic-dialog";
import { Button } from "@/components/ui/button";
import { SoilSchema } from "@/schemas";
import { useDialog } from "@/stores/use-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { UnitType } from "@prisma/client";
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
import { DialogClose, DialogFooter } from "@/components/ui/dialog";

import { SoilTable } from "@/types";
import { UnitsSelectWithQueryClient } from "@/app/[locale]/(backoffice)/admin/_components/units-select";
import { edit } from "@/actions/soil";
import { convertNullToUndefined } from "@/lib/utils";

interface SoilEditButtonProps {
  data: SoilTable;
  label: string;
}

export const SoilEditButton = ({ data, label }: SoilEditButtonProps) => {
  const { onOpen } = useDialog();
  return (
    <Button
      className="w-full"
      onClick={() =>
        onOpen("soil.edit", {
          soil: data,
        })
      }
      size={"sm"}
      variant={"edit"}
      disabled={data.confirmed}
    >
      <Edit className="w-6 h-6 mr-2" />
      {label}
    </Button>
  );
};
export const SoilEditDialog = () => {
  const { isOpen, type, data, onClose } = useDialog();
  const isOpenDialog = isOpen && type === "soil.edit";

  const tSchema = useTranslations("soils.schema");
  const t = useTranslations("soils");
  const formSchema = SoilSchema(tSchema);

  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: useMemo(() => {
      return !!data.soil ? convertNullToUndefined(data.soil) : undefined;
    }, [data.soil]),
  });
  const [id, setId] = useState("");
  useEffect(() => {
    if (data?.soil) {
      form.reset(convertNullToUndefined(data.soil));

      setId(data.soil.id);
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
            name="ph"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("ph.label")}</FormLabel>
                <div className="flex gap-x-2">
                  <FormControl>
                    <Input
                      placeholder={tSchema("ph.placeholder")}
                      {...field}
                      disabled={isPending}
                      type="number"
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid lg:grid-cols-2 gap-2">
            <div className="grid grid-cols-4 gap-2">
              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name="moisture.value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tSchema("moisture.label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={tSchema("moisture.placeholder")}
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
                name="moisture.unitId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("moisture.unitId.label")}</FormLabel>
                    <FormControl>
                      <UnitsSelectWithQueryClient
                        onChange={field.onChange}
                        placeholder={tSchema("moisture.unitId.placeholder")}
                        unitType={UnitType.PERCENT}
                        disabled={isPending}
                        className="w-full"
                        errorLabel={tSchema("moisture.unitId.error")}
                        notFound={tSchema("moisture.unitId.notFound")}
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
              name="nutrientUnitId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("nutrientUnitId.label")}</FormLabel>
                  <div className="flex gap-x-2">
                    <FormControl>
                      <UnitsSelectWithQueryClient
                        onChange={field.onChange}
                        placeholder={tSchema("nutrientUnitId.placeholder")}
                        unitType={UnitType.NUTRIENT}
                        disabled={isPending}
                        className="w-full"
                        errorLabel={tSchema("nutrientUnitId.error")}
                        notFound={tSchema("nutrientUnitId.notFound")}
                        defaultValue={field.value}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-2">
            <FormField
              control={form.control}
              name="nutrientNitrogen"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("nutrientNitrogen.label")}</FormLabel>
                  <div className="flex gap-x-2">
                    <FormControl>
                      <Input
                        placeholder={tSchema("nutrientNitrogen.placeholder")}
                        {...field}
                        disabled={isPending}
                        type="number"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nutrientPhosphorus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("nutrientPhosphorus.label")}</FormLabel>
                  <div className="flex gap-x-2">
                    <FormControl>
                      <Input
                        placeholder={tSchema("nutrientPhosphorus.placeholder")}
                        {...field}
                        disabled={isPending}
                        type="number"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nutrientPotassium"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("nutrientPotassium.label")}</FormLabel>
                  <div className="flex gap-x-2">
                    <FormControl>
                      <Input
                        placeholder={tSchema("nutrientPotassium.placeholder")}
                        {...field}
                        disabled={isPending}
                        type="number"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
