"use client";
import {
  DynamicDialog,
  DynamicDialogFooter,
} from "@/components/dialog/dynamic-dialog";
import { EquipmentDetailSchema } from "@/schemas";
import { useDialog } from "@/stores/use-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { EquipmentStatus } from "@prisma/client";
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
import { edit } from "@/actions/equipment-detail";
import { Input } from "@/components/ui/input";
import { SelectOptions } from "@/components/form/select-options";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import { canUpdateEquipmentDetail } from "@/lib/permission";

export const EquipmentDetailEditDialog = () => {
  const { isOpen, type, data, onClose } = useDialog();
  const isOpenDialog = isOpen && type === "equipmentDetail.edit";

  const tSchema = useTranslations("equipmentDetails.schema");
  const t = useTranslations("equipmentDetails");
  const formSchema = EquipmentDetailSchema(tSchema);

  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { isOnlyAdmin } = useCurrentStaffRole();
  const canEdit =
    isOnlyAdmin &&
    data.equipmentDetail &&
    canUpdateEquipmentDetail(data.equipmentDetail?.status);
  const [id, setId] = useState("");
  useEffect(() => {
    if (data?.equipmentDetail) {
      form.reset(data.equipmentDetail);
      setId(data.equipmentDetail.id);
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
          toast.error("Internal error");
        });
    });
  };
  return (
    <DynamicDialog
      isOpen={isOpenDialog}
      title={t("form.edit.title")}
      description={t("form.edit.description")}
    >
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
                    value={field.value ?? undefined}
                    onChange={field.onChange}
                    disabled={isPending || !canEdit}
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
                    placeholder={tSchema("status.placeholder")}
                    onChange={field.onChange}
                    options={Object.values(EquipmentStatus).map((item) => {
                      return {
                        label: tSchema(`status.options.${item}`),
                        value: item,
                      };
                    })}
                    disabled={isPending || !canEdit}
                    defaultValue={field.value}
                    disabledValues={[
                      EquipmentStatus.WORKING,
                      EquipmentStatus.MAINTENANCE,
                    ]}
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
                    value={field.value ?? undefined}
                    onChange={field.onChange}
                    disabled={isPending || !canEdit}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxOperatingHours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("maxOperatingHours.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tSchema("maxOperatingHours.placeholder")}
                    value={field.value ?? undefined}
                    onChange={field.onChange}
                    disabled={isPending || !canEdit}
                    type="number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DynamicDialogFooter
            disabled={isPending || !canEdit}
            closeButton={false}
          />
        </form>
      </Form>
    </DynamicDialog>
  );
};
