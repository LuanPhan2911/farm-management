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
import slugify from "slugify";
import { toast } from "sonner";
import { z } from "zod";
import { StaffsSelect } from "../../../_components/staffs-select";
import { DynamicDialogFooter } from "@/components/dialog/dynamic-dialog";
interface OrgCreateButtonProps {}

export const OrgCreateButton = ({}: OrgCreateButtonProps) => {
  const t = useTranslations("organizations.form");
  const tSchema = useTranslations("organizations.schema");
  const formSchema = OrganizationSchema(tSchema);

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const [isOpen, setOpen] = useState(false);
  const orgName = form.watch("name");
  useEffect(() => {
    if (!orgName) {
      return;
    }
    form.setValue(
      "slug",
      slugify(orgName, {
        lower: true,
        replacement: "-",
        trim: true,
      })
    );
  }, [orgName, form]);
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
  const fetchCreatedByOrg = async () => {
    const res = await fetch("/api/staffs/contain_admin");
    return await res.json();
  };
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"success"} size={"sm"}>
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
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("slug.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tSchema("slug.placeholder")}
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
              name="createdBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("createdBy.label")}</FormLabel>
                  <FormControl>
                    <div className="block">
                      <StaffsSelect
                        queryKey={["staffs_contain_admin"]}
                        queryFn={fetchCreatedByOrg}
                        defaultValue={field.value}
                        onChange={field.onChange}
                        errorLabel={tSchema("createdBy.error")}
                        label={tSchema("createdBy.placeholder")}
                        notFound={tSchema("createdBy.notFound")}
                        disabled={isPending}
                      />
                    </div>
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
