"use client";

import { create } from "@/actions/staff";
import { DynamicDialogFooter } from "@/components/dialog/dynamic-dialog";
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

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, RefreshCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { StaffSelectRole } from "../../../_components/staff-select-role";
import { generateEmail, generatePassword } from "@/lib/utils";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DatePicker } from "@/components/form/date-picker";

export const StaffCreateButton = () => {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("staffs.form");
  const tSchema = useTranslations("staffs.schema");
  const formSchema = StaffSchema(tSchema);
  const { isSuperAdmin } = useCurrentStaffRole();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "farmer",
      startToWorkDate: new Date(),
    },
  });

  const [isOpen, setOpen] = useState(false);
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
            setOpen(false);
          } else {
            toast.error(message);
          }
        })
        .catch((error: Error) => {
          toast.error("Internal error");
        });
    });
  };
  const refreshPassword = () => {
    form.setValue("password", generatePassword(8));
  };
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"success"}
          size={"sm"}
          disabled={isPending || !isSuperAdmin}
        >
          <Plus className="h-4 w-4 mr-2" />{" "}
          <span className="text-sm font-semibold">{t("create.label")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{t("create.title")}</DialogTitle>
          <DialogDescription>{t("create.description")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
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
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("role.label")}</FormLabel>
                    <FormControl>
                      <StaffSelectRole
                        defaultValue={field.value ?? undefined}
                        onChange={field.onChange}
                        placeholder={tSchema("role.placeholder")}
                        disabled={!isSuperAdmin}
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("email.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={tSchema("email.placeholder")}
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("password.label")}</FormLabel>
                    <div className="flex gap-x-2">
                      <FormControl>
                        <Input
                          placeholder={tSchema("password.placeholder")}
                          value={field.value ?? undefined}
                          onChange={field.onChange}
                          disabled={isPending}
                        />
                      </FormControl>
                      <Button
                        size={"icon"}
                        onClick={refreshPassword}
                        type="button"
                        variant={"blue"}
                      >
                        <RefreshCcw className="h-4 w-4" />
                      </Button>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
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
            </div>

            <div className="grid lg:grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="startToWorkDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("startToWorkDate.label")}</FormLabel>
                    <FormControl>
                      <DatePicker
                        placeholder={tSchema("startToWorkDate.placeholder")}
                        onChange={field.onChange}
                        value={field.value}
                        disabledDateRange={{
                          before: new Date(),
                        }}
                        disabled={isPending}
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

            <DynamicDialogFooter disabled={isPending} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
