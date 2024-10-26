"use client";

import { edit } from "@/actions/task";
import {
  DynamicSheet,
  DynamicSheetFooter,
} from "@/components/dialog/dynamic-sheet";
import { TaskSchema } from "@/schemas";
import { useSheet } from "@/stores/use-sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DatePickerWithTime } from "@/components/form/date-picker-with-time";
import { parseToDate } from "@/lib/utils";
import { JSONEditorReact } from "@/components/vanila-json-editor";
import {
  Content,
  Mode,
  OnChangeStatus,
  toTextContent,
} from "vanilla-jsoneditor";

export const TaskEditSheet = () => {
  const { data, isOpen, onClose, type } = useSheet();
  const isOpenSheet = isOpen && type === "task.edit";
  const tSchema = useTranslations("tasks.schema");
  const t = useTranslations("tasks.form");

  const formSchema = TaskSchema(tSchema);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
  });
  const [id, setId] = useState("");
  useEffect(() => {
    if (data?.task) {
      const { id, request } = data.task;
      form.reset({
        ...data.task,
        request: {
          url: request.url,
          body: request.body,
          headers: request.headers ? JSON.stringify(request.headers) : "",
        },
      });

      setId(id);
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
        .catch((error: Error) => {
          toast.error("Internal error");
        });
    });
  };

  return (
    <DynamicSheet
      isOpen={isOpenSheet}
      title={t("edit.title")}
      description={t("edit.description")}
      side={"right"}
      className="lg:max-w-[600px] w-full overflow-y-auto"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 my-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("name.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tSchema("name.placeholder")}
                    value={field.value || ""}
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
            name="scheduled_for"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("scheduled_for.label")}</FormLabel>
                <FormControl>
                  <DatePickerWithTime
                    value={parseToDate(field.value)}
                    onChange={(date) => {
                      field.onChange(date?.toISOString());
                    }}
                    disabled={isPending}
                    placeholder={tSchema("scheduled_for.placeholder")}
                    disabledDateRange={{
                      before: new Date(),
                    }}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="request.url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("request.url.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tSchema("request.url.placeholder")}
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
            name="request.headers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("request.headers.label")}</FormLabel>
                <FormControl>
                  <JSONEditorReact
                    content={{
                      text: field.value || "",
                    }}
                    mode={Mode.text}
                    mainMenuBar={false}
                    onChange={(
                      content: Content,
                      previousContent: Content,
                      status: OnChangeStatus
                    ) => {
                      field.onChange(toTextContent(content).text);
                    }}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="request.body"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("request.body.label")}</FormLabel>
                <FormControl>
                  <JSONEditorReact
                    content={{
                      text: field.value || "",
                    }}
                    onChange={(
                      content: Content,
                      previousContent: Content,
                      status: OnChangeStatus
                    ) => {
                      field.onChange(toTextContent(content).text);
                    }}
                    mode={Mode.text}
                    mainMenuBar={false}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <DynamicSheetFooter disabled={isPending} />
        </form>
      </Form>
    </DynamicSheet>
  );
};
