"use client";
import { DynamicDialog } from "@/components/dynamic-dialog";
import { Button } from "@/components/ui/button";
import { CategorySchema } from "@/schemas";
import { useDialog } from "@/stores/use-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category } from "@prisma/client";
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
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface CategoryEditButtonProps {
  data: Category;
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
      onClick={() =>
        onOpen("category.edit", {
          category: data,
        })
      }
    >
      <Edit className="w-6 h-6 mr-2" />
      {label}
    </Button>
  );
};
export const CategoryEditDialog = () => {
  const { isOpen, type, data, onClose } = useDialog();
  const isOpenDialog = isOpen && type === "category.edit";

  const tSchema = useTranslations("categories.schema");
  const tEdit = useTranslations("categories.form.edit");
  const tForm = useTranslations("form");
  const formSchema = CategorySchema(tSchema);

  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const [id, setId] = useState("");
  useEffect(() => {
    if (data?.category) {
      form.setValue("name", data.category.name);
      form.setValue("description", data.category.description);
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
          toast.error(tForm("error"));
        });
    });
  };
  return (
    <DynamicDialog
      isOpen={isOpenDialog}
      title={tEdit("title")}
      description={tEdit("description")}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("description.label")}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={tSchema("description.placeholder")}
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                {tForm("button.close")}
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {tForm("button.submit")}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DynamicDialog>
  );
};
