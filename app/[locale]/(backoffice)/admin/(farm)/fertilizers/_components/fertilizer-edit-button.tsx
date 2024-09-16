"use client";
import { DynamicDialog } from "@/components/dialog/dynamic-dialog";
import { Button } from "@/components/ui/button";
import { FertilizerSchema } from "@/schemas";
import { useDialog } from "@/stores/use-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { FertilizerType, Frequency, UnitType } from "@prisma/client";
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
import { SelectOptions } from "@/components/form/select-options";
import { FertilizerTable } from "@/types";
import { UnitsSelectWithQueryClient } from "@/app/[locale]/(backoffice)/admin/_components/units-select";
import { edit } from "@/actions/fertilizer";
import { Textarea } from "@/components/ui/textarea";

interface FertilizerEditButtonProps {
  data: FertilizerTable;
  label: string;
}

export const FertilizerEditButton = ({
  data,
  label,
}: FertilizerEditButtonProps) => {
  const { onOpen } = useDialog();
  return (
    <Button
      className="w-full"
      onClick={() =>
        onOpen("fertilizer.edit", {
          fertilizer: data,
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
export const FertilizerEditDialog = () => {
  const { isOpen, type, data, onClose } = useDialog();
  const isOpenDialog = isOpen && type === "fertilizer.edit";

  const tSchema = useTranslations("fertilizers.schema");
  const t = useTranslations("fertilizers");
  const formSchema = FertilizerSchema(tSchema);

  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const [id, setId] = useState("");
  useEffect(() => {
    if (data?.fertilizer) {
      const {
        applicationMethod,
        composition,
        frequencyOfUse,
        manufacturer,
        name,
        nutrientOfNPK,
        recommendedDosage,
        type,
      } = data.fertilizer;
      form.setValue("name", name);
      form.setValue("applicationMethod", applicationMethod || undefined);
      form.setValue("composition", composition || undefined);
      form.setValue("frequencyOfUse", frequencyOfUse || undefined);
      form.setValue("manufacturer", manufacturer || undefined);
      form.setValue("type", type);
      form.setValue("recommendedDosage", recommendedDosage || undefined);
      form.setValue("nutrientOfNPK", nutrientOfNPK);
      setId(data.fertilizer.id);
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
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
            name="nutrientOfNPK"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("nutrientOfNPK.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tSchema("nutrientOfNPK.placeholder")}
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
                      options={Object.keys(FertilizerType).map((item) => {
                        return {
                          label: tSchema(`type.options.${item}`),
                          value: item,
                        };
                      })}
                      defaultValue={field.value}
                      disabled={isPending}
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
                  name="recommendedDosage.value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {tSchema("recommendedDosage.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={tSchema("recommendedDosage.placeholder")}
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
                name="recommendedDosage.unitId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {tSchema("recommendedDosage.unitId.label")}
                    </FormLabel>
                    <FormControl>
                      <UnitsSelectWithQueryClient
                        onChange={field.onChange}
                        placeholder={tSchema(
                          "recommendedDosage.unitId.placeholder"
                        )}
                        unitType={UnitType.VOLUME}
                        disabled={isPending}
                        className="w-full"
                        errorLabel={tSchema("recommendedDosage.unitId.error")}
                        notFound={tSchema("recommendedDosage.unitId.notFound")}
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
            <FormField
              control={form.control}
              name="applicationMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("applicationMethod.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tSchema("applicationMethod.placeholder")}
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
              name="frequencyOfUse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("frequencyOfUse.label")}</FormLabel>
                  <FormControl>
                    <SelectOptions
                      label={tSchema("frequencyOfUse.placeholder")}
                      onChange={field.onChange}
                      defaultValue={field.value}
                      options={Object.keys(Frequency).map((item) => {
                        return {
                          label: tSchema(`frequencyOfUse.options.${item}`),
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

          <FormField
            control={form.control}
            name="composition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("composition.label")}</FormLabel>
                <div className="flex gap-x-2">
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={isPending}
                      placeholder={tSchema("composition.placeholder")}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="manufacturer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("manufacturer.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tSchema("manufacturer.placeholder")}
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
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
