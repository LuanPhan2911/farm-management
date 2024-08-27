"use client";
import { create } from "@/actions/organization";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { useEffect, useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import { toast } from "sonner";
import { z } from "zod";
import { OrgSelectCreatedBy } from "./org-select-created-by";
import { QueryProvider } from "@/components/providers/query-provider";
interface OrgCreateButtonProps {}

export const OrgCreateButton = ({}: OrgCreateButtonProps) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const t = useTranslations("organizations");
  const tSchema = useTranslations("organizations.schema");
  const formSchema = OrganizationSchema(tSchema);

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      createdBy: "",
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
      create(values)
        .then(({ message, ok }) => {
          if (ok) {
            form.reset();
            closeRef.current?.click();
            toast.success(message);
          } else {
            toast.error(message);
          }
        })
        .catch((error: Error) => {
          toast.error(t("status.failure.create"));
        });
    });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"success"} size={"sm"}>
          <Plus className="h-6 w-6 mr-2" />{" "}
          <span className="text-sm font-semibold">
            {t("form.create.label")}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("form.create.title")}</DialogTitle>
          <DialogDescription>{t("form.create.description")}</DialogDescription>
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
              <FormField
                control={form.control}
                name="createdBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("createdBy.label")}</FormLabel>
                    <FormControl>
                      <div className="block">
                        <QueryProvider>
                          <OrgSelectCreatedBy
                            defaultValue={field.value}
                            onChange={field.onChange}
                            disabled={isPending}
                            label={tSchema("createdBy.placeholder")}
                            notFound={tSchema("createdBy.notFound")}
                          />
                        </QueryProvider>
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary" ref={closeRef}>
                    Close
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isPending}>
                  Submit
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
