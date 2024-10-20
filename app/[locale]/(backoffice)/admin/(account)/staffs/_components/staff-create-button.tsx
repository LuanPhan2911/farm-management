"use client";

import { create } from "@/actions/staff";
import {
  DynamicDialog,
  DynamicDialogFooter,
} from "@/components/dialog/dynamic-dialog";
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
import { StaffSchema } from "@/schemas";
import { useDialog } from "@/stores/use-dialog";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, RefreshCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { StaffSelectRole } from "../../../_components/staff-select-role";
import { generateEmail, generatePassword } from "@/lib/utils";
import { StaffRole } from "@prisma/client";

export const StaffCreateButton = () => {
  const { onOpen } = useDialog();
  const t = useTranslations("staffs.form.create");

  return (
    <Button
      onClick={() => onOpen("staff.create")}
      size={"sm"}
      variant={"success"}
    >
      <Plus className="h-4 w-4 mr-2" />
      {t("label")}
    </Button>
  );
};
export const StaffCreateDialog = () => {
  const { isOpen, type, onClose } = useDialog();

  const isOpenDialog = isOpen && type === "staff.create";
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("staffs.form");
  const tSchema = useTranslations("staffs.schema");
  const formSchema = StaffSchema(tSchema);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "farmer",
    },
  });
  const watchName = form.watch("name");
  useEffect(() => {
    if (watchName) {
      form.setValue("email", generateEmail(watchName));
    }
  }, [watchName, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(() => {
      create(values)
        .then(({ message, ok }) => {
          if (ok) {
            toast.success(message);
            form.reset();
          } else {
            toast.error(message);
          }
        })
        .catch((error: Error) => {
          toast.error("Internal error");
        })
        .finally(() => {
          onClose();
        });
    });
  };
  const refreshPassword = () => {
    form.setValue("password", generatePassword(8));
  };
  return (
    <DynamicDialog
      isOpen={isOpenDialog}
      title={t("create.title")}
      description={t("create.description")}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("email.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tSchema("email.placeholder")}
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("password.label")}</FormLabel>
                <div className="flex gap-x-2">
                  <FormControl>
                    <Input
                      placeholder={tSchema("password.placeholder")}
                      value={field.value || undefined}
                      onChange={field.onChange}
                      disabled={isPending}
                    />
                  </FormControl>
                  <Button size={"sm"} onClick={refreshPassword} type="button">
                    <RefreshCcw />
                  </Button>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("role.label")}</FormLabel>
                <FormControl>
                  <StaffSelectRole
                    defaultValue={field.value || undefined}
                    onChange={field.onChange}
                    placeholder={tSchema("role.placeholder")}
                    disabled={isPending}
                    hidden={[StaffRole.superadmin]}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="receiverEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("receiverEmail.label")}</FormLabel>

                <FormControl>
                  <Input
                    placeholder={tSchema("receiverEmail.placeholder")}
                    value={field.value || undefined}
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
