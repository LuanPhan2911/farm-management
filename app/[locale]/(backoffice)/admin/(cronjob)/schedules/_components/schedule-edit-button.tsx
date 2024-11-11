"use client";

import { edit } from "@/actions/schedule";
import {
  DynamicSheet,
  DynamicSheetFooter,
} from "@/components/dialog/dynamic-sheet";
import { ScheduleSchema } from "@/schemas";
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
import { generateCronExplanation } from "@/lib/utils";
import { JSONEditorReact } from "@/components/vanila-json-editor";
import {
  Content,
  Mode,
  OnChangeStatus,
  toTextContent,
} from "vanilla-jsoneditor";
import { ScheduleSelectCron } from "../../../_components/schedule-select-cron";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScheduleResponse } from "@/types";
import { Edit } from "lucide-react";
interface ScheduleEditButtonProps {
  data: ScheduleResponse;
  label: string;
}
export const ScheduleEditButton = ({
  data,
  label,
}: ScheduleEditButtonProps) => {
  const { onOpen } = useSheet();
  return (
    <Button
      className="w-full"
      onClick={(e) => {
        e.stopPropagation();
        onOpen("schedule.edit", {
          schedule: data,
        });
      }}
      size={"sm"}
      variant={"edit"}
    >
      <Edit className="w-4 h-4 mr-2" />
      {label}
    </Button>
  );
};

export const ScheduleEditSheet = () => {
  const { data, isOpen, onClose, type } = useSheet();
  const isOpenSheet = isOpen && type === "schedule.edit";
  const tSchema = useTranslations("schedules.schema");
  const t = useTranslations("schedules.form");

  const formSchema = ScheduleSchema(tSchema);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
  });
  const [id, setId] = useState("");
  useEffect(() => {
    if (data?.schedule) {
      const { id, request } = data.schedule;
      form.reset({
        ...data.schedule,
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("description.label")}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={tSchema("description.placeholder")}
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
            name="cron"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>{tSchema("cron.label")}</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="col-span-3">
                      <Input
                        placeholder={tSchema("cron.placeholder")}
                        value={field.value ?? undefined}
                        onChange={field.onChange}
                        disabled={isPending}
                      />
                    </div>
                    <ScheduleSelectCron
                      onChange={field.onChange}
                      placeholder="Custom"
                      defaultValue={field.value ?? undefined}
                      disabled={isPending}
                    />
                  </div>
                </FormControl>
                {fieldState.invalid ? (
                  <FormMessage />
                ) : (
                  <div className="text-sm font-medium text-green-400 my-2">
                    <span>Next run: </span>
                    <span className="text-green-400">
                      {generateCronExplanation(field.value)}
                    </span>
                  </div>
                )}
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
