"use client";

import { create } from "@/actions/equipment-detail";
import { DynamicDialogFooter } from "@/components/dialog/dynamic-dialog";
import { SelectOptions } from "@/components/form/select-options";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EquipmentDetailSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { EquipmentStatus } from "@prisma/client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const EquipmentDetailCreateButton = () => {
  const tSchema = useTranslations("equipmentDetails.schema");
  const formSchema = EquipmentDetailSchema(tSchema);
  const t = useTranslations("equipmentDetails.form");
  const [isPending, startTransition] = useTransition();

  const params = useParams<{
    equipmentId: string;
  }>()!;
  const [isOpen, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      equipmentId: params.equipmentId,
    },
  });
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(() => {
      create(values)
        .then(({ message, ok }) => {
          if (ok) {
            toast.success(message);
            setOpen(false);
          } else {
            toast.error(message);
          }
        })
        .catch((error) => {});
    });
  };
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"success"} size={"sm"}>
          <Plus className="mr-2" />
          {t("create.label")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 max-w-4xl"
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
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("status.label")}</FormLabel>
                  <FormControl>
                    <SelectOptions
                      label={tSchema("status.placeholder")}
                      onChange={field.onChange}
                      options={Object.values(EquipmentStatus).map((item) => {
                        return {
                          label: tSchema(`status.options.${item}`),
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
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("location.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tSchema("location.placeholder")}
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
              name="maintenanceSchedule"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("maintenanceSchedule.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tSchema("maintenanceSchedule.placeholder")}
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
              name="operatingHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("operatingHours.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tSchema("operatingHours.placeholder")}
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

            <DynamicDialogFooter disabled={isPending} closeButton={false} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
