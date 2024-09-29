"use client";

import { ClipboardButton } from "@/components/buttons/clipboard-button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserSchema } from "@/schemas";
import { User } from "@clerk/nextjs/server";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Separator } from "@/components/ui/separator";
import { StaffInfo } from "./staff-info";
import { edit } from "@/actions/staff";
import { getEmailAddress } from "@/lib/utils";
import { DynamicDialogFooter } from "@/components/dialog/dynamic-dialog";

interface StaffBasicInfoProps {
  data: User;
}
export const StaffBasicInfo = ({ data }: StaffBasicInfoProps) => {
  const tSchema = useTranslations("users.schema");
  const t = useTranslations("staffs");
  const formSchema = UserSchema(tSchema);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      address: (data.publicMetadata?.address as string) || "",
      email: getEmailAddress(data),
      phone: (data.publicMetadata?.phone as string) || "",
    },
  });

  const [isPending, startTransition] = useTransition();
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(() => {
      edit(values, data.id)
        .then(({ message, ok }) => {
          if (ok) {
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
    <>
      <StaffInfo data={data} />
      <Separator className="my-4" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormItem>
            <FormLabel>{tSchema("id.label")}</FormLabel>
            <div className="flex gap-x-2">
              <Input
                placeholder={tSchema("id.placeholder")}
                value={data.id}
                disabled={true}
              />
              <ClipboardButton value={data.id} />
            </div>
          </FormItem>
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
                    disabled={true}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("firstName.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tSchema("firstName.placeholder")}
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
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("lastName.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tSchema("lastName.placeholder")}
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
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("address.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tSchema("address.placeholder")}
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
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("phone.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tSchema("phone.placeholder")}
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
    </>
  );
};
