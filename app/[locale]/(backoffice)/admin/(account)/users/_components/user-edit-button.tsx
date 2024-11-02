"use client";

import { edit } from "@/actions/user";

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
import { InputClipboard } from "@/components/form/input-clipboard";
import { getEmailAddress } from "@/lib/utils";
import { DynamicDialogFooter } from "@/components/dialog/dynamic-dialog";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";

interface UserEditFormProps {
  data: User;
}
export const UserEditForm = ({ data }: UserEditFormProps) => {
  const tSchema = useTranslations("users.schema");
  const formSchema = UserSchema(tSchema);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: getEmailAddress(data),
      address: (data.publicMetadata?.address as string) || undefined,
      phone: (data.publicMetadata?.phone as string) || undefined,
      firstName: data.firstName,
      lastName: data.lastName,
    },
  });
  const { isSuperAdmin, user } = useCurrentStaffRole();
  const [isPending, startTransition] = useTransition();
  const isOwner = user?.id === data.id;
  const disabled = !isSuperAdmin && !isOwner;

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
          toast.error("Internal error");
        });
    });
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-5xl"
      >
        <InputClipboard label={tSchema("id.label")} value={data.id} />
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
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tSchema("firstName.label")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={tSchema("firstName.placeholder")}
                  value={field.value ?? undefined}
                  onChange={field.onChange}
                  disabled={isPending || disabled}
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
                  value={field.value ?? undefined}
                  onChange={field.onChange}
                  disabled={isPending || disabled}
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
                  disabled={isPending || disabled}
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
                  disabled={isPending || disabled}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <DynamicDialogFooter
          disabled={isPending || disabled}
          closeButton={false}
        />
      </form>
    </Form>
  );
};
