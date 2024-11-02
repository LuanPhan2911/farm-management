"use client";
import {
  DynamicDialog,
  DynamicDialogFooter,
} from "@/components/dialog/dynamic-dialog";
import { Button } from "@/components/ui/button";
import { EquipmentUsageSchema } from "@/schemas";
import { useDialog } from "@/stores/use-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { edit } from "@/actions/equipment-usage";
import { Input } from "@/components/ui/input";
import { EquipmentUsageTable } from "@/types";
import { DatePickerWithTime } from "@/components/form/date-picker-with-time";
import { Textarea } from "@/components/ui/textarea";

interface EquipmentUsageEditButtonProps {
  data: EquipmentUsageTable;
  label: string;
  disabled?: boolean;
}

export const EquipmentUsageEditButton = ({
  data,
  label,
  disabled,
}: EquipmentUsageEditButtonProps) => {
  const { onOpen } = useDialog();
  return (
    <Button
      className="w-full"
      onClick={(e) => {
        e.stopPropagation();
        onOpen("equipmentUsage.edit", {
          equipmentUsage: data,
        });
      }}
      size={"sm"}
      variant={"edit"}
      disabled={disabled}
    >
      <Edit className="w-4 h-4 mr-2" />
      {label}
    </Button>
  );
};
export const EquipmentUsageEditDialog = () => {
  const { isOpen, type, data, onClose } = useDialog();
  const isOpenDialog = isOpen && type === "equipmentUsage.edit";

  const tSchema = useTranslations("equipmentUsages.schema");
  const t = useTranslations("equipmentUsages.form");
  const formSchema = EquipmentUsageSchema(tSchema);

  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const [id, setId] = useState("");
  useEffect(() => {
    if (data?.equipmentUsage) {
      form.reset(data.equipmentUsage);
      setId(data.equipmentUsage.id);
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
      title={t("edit.title")}
      description={t("edit.description")}
      className="max-w-4xl"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid lg:grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="usageStartTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("usageStartTime.label")}</FormLabel>
                  <FormControl>
                    <DatePickerWithTime
                      onChange={field.onChange}
                      placeholder={tSchema("usageStartTime.placeholder")}
                      disabled={isPending}
                      value={field.value}
                      disabledDateRange={{
                        before: new Date(),
                      }}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("duration.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tSchema("duration.placeholder")}
                      value={field.value ?? undefined}
                      onChange={field.onChange}
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
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("note.label")}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={tSchema("note.placeholder")}
                    value={field.value ?? undefined}
                    onChange={field.onChange}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DynamicDialogFooter disabled={isPending} />
        </form>
      </Form>
    </DynamicDialog>
  );
};
