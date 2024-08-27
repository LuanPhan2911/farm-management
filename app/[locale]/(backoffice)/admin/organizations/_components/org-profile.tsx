"use client";
import { ClipboardButton } from "@/components/clipboard-button";
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
import { OrganizationSchema } from "@/schemas";
import { Organization } from "@clerk/nextjs/server";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FileUploader } from "react-drag-drop-files";
import { edit, editLogo } from "@/actions/organization";
import slugify from "slugify";
import { UserAvatar } from "@/components/user-avatar";
interface OrgProfileProps {
  data: Organization;
}
export const OrgProfile = ({ data }: OrgProfileProps) => {
  const { relativeTime } = useFormatter();
  const t = useTranslations("organizations");
  const tSchema = useTranslations("organizations.schema");
  const formSchema = OrganizationSchema(tSchema);

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data.name,
      slug: data.slug || "",
    },
  });
  const watchName = form.watch("name");
  useEffect(() => {
    form.setValue(
      "slug",
      slugify(watchName, {
        lower: true,
        replacement: "-",
        trim: true,
      })
    );
  }, [watchName, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(() => {
      edit(values, data.id)
        .then(({ message, ok }) => {
          if (ok) {
            form.reset();
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
  const onUpload = (file: File) => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      startTransition(() => {
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
              console.log(error);

              toast.error(t("status.failure.editLogo"));
            });
        });
      });
    }
  };
  return (
    <Card className="grid grid-cols-1 lg:grid-cols-2 p-6">
      <CardHeader>
        <CardTitle>{t("tabs.profile.title")}</CardTitle>
        <CardDescription>{t("tabs.profile.description")}</CardDescription>
        <UserAvatar src={data.imageUrl} size={"lg"} />
        <h3 className="text-lg font-semibold">{data.name}</h3>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormItem>
              <FormLabel>{tSchema("id.label")}</FormLabel>
              <div className="flex gap-x-2">
                <Input value={data.id} disabled={true} />
                <ClipboardButton value={data.id} />
              </div>
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
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("slug.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tSchema("slug.placeholder")}
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>{tSchema("createdAt.label")}</FormLabel>
              <p className="font-bold text-sm">
                {relativeTime(data.createdAt)}
              </p>
            </FormItem>
            <FormItem>
              <FormLabel>{tSchema("logo.label")}</FormLabel>
              <FileUploader handleChange={onUpload} types={["JPG", "PNG"]} />
            </FormItem>

            <div className="ml-auto">
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
