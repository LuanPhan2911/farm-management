"use client";
import { create } from "@/actions/organization";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { OrganizationSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { StaffsSelect } from "../../../_components/staffs-select";
import { DynamicDialogFooter } from "@/components/dialog/dynamic-dialog";
import { useCurrentStaff } from "@/hooks/use-current-staff";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import { useAuth } from "@clerk/nextjs";
import { getSlug } from "@/lib/utils";

export const OrgCreateButton = () => {
  const t = useTranslations("organizations.form");
  const tSchema = useTranslations("organizations.schema");
  const formSchema = OrganizationSchema(tSchema);

  const { orgId } = useAuth();
  const [isPending, startTransition] = useTransition();
  const { currentStaff } = useCurrentStaff();

  const { isSuperAdmin } = useCurrentStaffRole();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const [isOpen, setOpen] = useState(false);
  const orgName = form.watch("name");
  useEffect(() => {
    form.setValue("slug", getSlug(orgName));
  }, [orgName, form]);
  useEffect(() => {
    if (currentStaff) {
      form.setValue("createdBy", currentStaff.id);
    }
  }, [currentStaff, form]);

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

  const canCreate = isSuperAdmin;

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"success"} size={"sm"} disabled={!canCreate}>
          <Plus className="h-4 w-4 mr-2" />{" "}
          <span className="text-sm font-semibold">{t("create.label")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("create.title")}</DialogTitle>
          <DialogDescription>{t("create.description")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 w-full"
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
                      disabled={isPending}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("slug.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tSchema("slug.placeholder")}
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
              name="createdBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("createdBy.label")}</FormLabel>
                  <FormControl>
                    <StaffsSelect
                      orgId={orgId}
                      defaultValue={field.value}
                      onChange={field.onChange}
                      error={tSchema("createdBy.error")}
                      placeholder={tSchema("createdBy.placeholder")}
                      notFound={tSchema("createdBy.notFound")}
                      disabled={isPending}
                      superAdminOnly
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <DynamicDialogFooter disabled={isPending} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
