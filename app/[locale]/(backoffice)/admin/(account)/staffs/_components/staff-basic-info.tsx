"use client";

import { ClipboardButton } from "@/components/buttons/clipboard-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Separator } from "@/components/ui/separator";
import { StaffInfo } from "./staff-info";
import { edit } from "@/actions/staff";
import { getEmailAddress } from "@/lib/utils";

interface StaffBasicInfoProps {
  data: User;
}
export const StaffBasicInfo = ({ data }: StaffBasicInfoProps) => {
  const tSchema = useTranslations("users.schema");
  const t = useTranslations("staffs");
  const formSchema = UserSchema(tSchema);
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      address: "",
      email: "",
      phone: "",
    },
  });
  useEffect(() => {
    const email = getEmailAddress(data);
    const address = (data.publicMetadata?.address as string) || "";
    const phoneNumber = (data.publicMetadata?.phone as string) || "";
    form.setValue("email", email);
    form.setValue("firstName", data.firstName || "");
    form.setValue("lastName", data.lastName || "");
    form.setValue("address", address);
    form.setValue("phone", phoneNumber);
  }, [data, form]);
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
    <Card>
      <CardHeader>
        <CardTitle>{t("page.detail.title")}</CardTitle>
        <CardDescription>{t("page.detail.description")}</CardDescription>
      </CardHeader>
      <CardContent>
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
                      {...field}
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
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("lastName.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tSchema("lastName.placeholder")}
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
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("address.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tSchema("address.placeholder")}
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
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("phone.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tSchema("phone.placeholder")}
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-x-2 justify-center">
              <Button type="submit" disabled={isPending}>
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
