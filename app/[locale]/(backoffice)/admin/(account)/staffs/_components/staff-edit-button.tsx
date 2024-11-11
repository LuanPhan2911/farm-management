"use client";
import {
  DynamicDialog,
  DynamicDialogFooter,
} from "@/components/dialog/dynamic-dialog";
import { StaffUpdateSchema } from "@/schemas";
import { useDialog } from "@/stores/use-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Staff } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { edit } from "@/actions/staff";

import { EditButton } from "@/components/buttons/edit-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { StaffSelectRole } from "../../../_components/staff-select-role";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import { useCurrentStaff } from "@/hooks/use-current-staff";

interface StaffEditButtonProps {
  data: Staff;
  disabled?: boolean;
}

export const StaffEditButton = ({ data, disabled }: StaffEditButtonProps) => {
  return (
    <EditButton
      inltKey="staffs"
      type="staff.edit"
      data={{ staff: data }}
      className="w-full"
      disabled={disabled}
    />
  );
};
export const StaffEditDialog = () => {
  const { isOpen, type, data, onClose } = useDialog();
  const isOpenDialog = isOpen && type === "staff.edit";

  const tSchema = useTranslations("staffs.schema");
  const t = useTranslations("staffs.form");
  const formSchema = StaffUpdateSchema(tSchema);
  const { isSuperAdmin } = useCurrentStaffRole();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const [id, setId] = useState("");

  useEffect(() => {
    if (data?.staff) {
      form.reset(data.staff);
      setId(data.staff.id);
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("name.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tSchema("name.placeholder")}
                      value={field.value ?? undefined}
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("email.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tSchema("email.placeholder")}
                      value={field.value ?? undefined}
                      onChange={field.onChange}
                      disabled={true}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("phone.label")}</FormLabel>

                  <FormControl>
                    <Input
                      placeholder={tSchema("phone.placeholder")}
                      value={field.value ?? undefined}
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
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("address.label")}</FormLabel>

                  <FormControl>
                    <Input
                      placeholder={tSchema("address.placeholder")}
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
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("role.label")}</FormLabel>
                  <FormControl>
                    <StaffSelectRole
                      defaultValue={field.value ?? undefined}
                      onChange={field.onChange}
                      placeholder={tSchema("role.placeholder")}
                      disabled={
                        isPending ||
                        !isSuperAdmin ||
                        field.value === "superadmin"
                      }
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="baseHourlyWage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("baseHourlyWage.label")}</FormLabel>

                  <FormControl>
                    <Input
                      placeholder={tSchema("baseHourlyWage.placeholder")}
                      value={field.value ?? undefined}
                      onChange={field.onChange}
                      disabled={isPending || !isSuperAdmin}
                      type="number"
                      min={0}
                      max={500_000}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <DynamicDialogFooter disabled={isPending} />
        </form>
      </Form>
    </DynamicDialog>
  );
};
