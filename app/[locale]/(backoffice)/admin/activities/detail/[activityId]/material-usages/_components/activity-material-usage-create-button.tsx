"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { z } from "zod";
import { MaterialUsageSchema } from "@/schemas";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import { create } from "@/actions/material-usage";
import { toast } from "sonner";

import { DynamicDialogFooter } from "@/components/dialog/dynamic-dialog";
import { useParams } from "next/navigation";
import { UnitsSelect } from "@/app/[locale]/(backoffice)/admin/_components/units-select";
import { UnitType } from "@prisma/client";
import { MaterialsSelect } from "@/app/[locale]/(backoffice)/admin/_components/materials-select";
interface ActivityMaterialUsageCreateButtonProps {
  disabled?: boolean;
}
export const ActivityMaterialUsageCreateButton = ({
  disabled,
}: ActivityMaterialUsageCreateButtonProps) => {
  const tSchema = useTranslations("materialUsages.schema");
  const t = useTranslations("materialUsages.form");
  const formSchema = MaterialUsageSchema(tSchema);
  const params = useParams<{ activityId: string }>();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      activityId: params?.activityId,
      quantityUsed: 1,
    },
  });
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
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={"sm"} variant={"success"} disabled={disabled}>
          <Plus className="h-4 w-4 mr-2" />{" "}
          <span className="text-sm font-semibold">{t("create.label")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{t("create.title")}</DialogTitle>
          <DialogDescription>{t("create.description")}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="materialId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("materialId.label")}</FormLabel>
                  <FormControl>
                    <MaterialsSelect
                      onChange={field.onChange}
                      placeholder={tSchema("materialId.placeholder")}
                      disabled={isPending || disabled}
                      error={tSchema("materialId.error")}
                      notFound={tSchema("materialId.notFound")}
                      appearance={{
                        button: "lg:w-full h-12",
                        content: "lg:w-[400px]",
                      }}
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
                  name="quantityUsed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tSchema("quantityUsed.label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={tSchema("quantityUsed.placeholder")}
                          value={field.value || undefined}
                          onChange={field.onChange}
                          disabled={isPending || disabled}
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
                        disabled={isPending || disabled}
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

            <DynamicDialogFooter disabled={isPending || disabled} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
