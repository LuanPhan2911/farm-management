"use client";
import { edit, editLogo } from "@/actions/organization";
import { DynamicDialogFooter } from "@/components/dialog/dynamic-dialog";
import { InputClipboard } from "@/components/form/input-clipboard";
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
import { Organization } from "@clerk/nextjs/server";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useContext, useEffect, useTransition } from "react";

import { FileUploader } from "react-drag-drop-files";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import { toast } from "sonner";
import { z } from "zod";
import { OrgContext } from "./org-tabs";

interface OrgEditFormProps {
  data: Organization;
}
export const OrgEditForm = ({ data }: OrgEditFormProps) => {
  const tSchema = useTranslations("organizations.schema");
  const formSchema = OrganizationSchema(tSchema);
  const [isPending, startTransition] = useTransition();
  const { canManageOrg } = useContext(OrgContext);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...data,
      slug: data.slug || undefined,
    },
  });
  const orgName = form.watch("name");
  useEffect(() => {
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
  const onUpload = (file: File) => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      startTransition(() => {
        editLogo(data.id, data.createdBy, formData)
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
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
        <FormItem>
          <InputClipboard label={tSchema("id.label")} value={data.id} />
        </FormItem>

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
                  disabled={isPending || !canManageOrg}
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
                  disabled={isPending || !canManageOrg}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem>
          <FormLabel>{tSchema("logo.label")}</FormLabel>
          <FileUploader
            handleChange={onUpload}
            types={["JPG", "PNG"]}
            disabled={isPending || !canManageOrg}
          />
        </FormItem>

        <DynamicDialogFooter
          disabled={isPending || !canManageOrg}
          closeButton={false}
        />
      </form>
    </Form>
  );
};
