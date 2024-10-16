"use client";
import {
  DynamicDialog,
  DynamicDialogFooter,
} from "@/components/dialog/dynamic-dialog";
import { Button } from "@/components/ui/button";
import { CategorySchema } from "@/schemas";
import { useDialog } from "@/stores/use-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { CategoryType } from "@prisma/client";
import { Edit } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { edit } from "@/actions/category";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import slugify from "slugify";
import { SelectOptions } from "@/components/form/select-options";
import { CategoryTable } from "@/types";

interface CategoryEditButtonProps {
  data: CategoryTable;
  label: string;
}

export const CategoryEditButton = ({
  data,
  label,
}: CategoryEditButtonProps) => {
  const { onOpen } = useDialog();
  return (
    <Button
      className="w-full"
      onClick={(e) => {
        e.stopPropagation();
        onOpen("category.edit", {
          category: data,
        });
      }}
      variant={"edit"}
    >
      <Edit className="w-4 h-4 mr-2" />
      {label}
    </Button>
  );
};
export const CategoryEditDialog = () => {
  const { isOpen, type, data, onClose } = useDialog();
  const isOpenDialog = isOpen && type === "category.edit";
  const tSchema = useTranslations("categories.schema");
  const formSchema = CategorySchema(tSchema);
  const t = useTranslations("categories");
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
  const [id, setId] = useState("");
  const name = form.watch("name");
  useEffect(() => {
    form.setValue(
      "slug",
      slugify(name, {
        lower: true,
      })
    );
  }, [name, form]);
  useEffect(() => {
    if (data?.category) {
      form.reset(data.category);
      setId(data.category.id);
    }
  }, [data, form]);
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!id) {
      return;
    }
    startTransition(() => {
      edit(values, id)
        .then(({ message, ok }) => {
          if (ok) {
            onClose();
            toast.success(message);
          } else {
            toast.error(message);
          }
        })
        .catch((error) => {
          toast.error(t("status.failure.edit.error"));
        });
    });
  };
  return (
    <DynamicDialog
      isOpen={isOpenDialog}
      title={t("form.edit.title")}
      description={t("form.edit.description")}
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
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("type.label")}</FormLabel>
                <FormControl>
                  <SelectOptions
                    label={tSchema("type.placeholder")}
                    onChange={field.onChange}
                    disabled={isPending}
                    options={Object.values(CategoryType).map((item) => {
                      return {
                        label: tSchema(`type.options.${item}`),
                        value: item,
                      };
                    })}
                    defaultValue={field.value}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("description.label")}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={tSchema("description.placeholder")}
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
