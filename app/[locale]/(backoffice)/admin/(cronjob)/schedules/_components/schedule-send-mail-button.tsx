"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SendEmailSchema, ScheduleSchema } from "@/schemas";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import { create } from "@/actions/schedule";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { generateCronExplanation, safeParseJSON } from "@/lib/utils";
import {
  Content,
  Mode,
  OnChangeStatus,
  toTextContent,
} from "vanilla-jsoneditor";
import { JSONEditorReact } from "@/components/vanila-json-editor";
import { DynamicSheetFooter } from "@/components/dialog/dynamic-sheet";
import { EmailBody } from "@/types";
import { EmailTemplate } from "@/components/mail/email-template";
import { StaffsSelectMultiple } from "../../../_components/staffs-select";
import { Label } from "@/components/ui/label";
import { ClipboardButton } from "@/components/buttons/clipboard-button";
import { ScheduleSelectCron } from "../../../_components/schedule-select-cron";
import { Textarea } from "@/components/ui/textarea";
const initialBody = {
  receivers: ["example@gmail.com"],
  subject: "Email notification salary",
  contents: ["Notify salary..."],
  sender: "From Accountant",
};

interface ScheduleSendMailButtonProps {
  appKey?: string | undefined;
  appUrl?: string | undefined;
}
export const ScheduleSendMailButton = ({
  appKey,
  appUrl,
}: ScheduleSendMailButtonProps) => {
  const tSchema = useTranslations("schedules.schema");

  const t = useTranslations("schedules.form");

  const formSchema = ScheduleSchema(tSchema);

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "send_mail_schedule",
      description: "Schedule for automatically send email",
      cron: "",
      request: {
        url: `${appUrl || "[Your HOST]"}/en/api/mails`,
        headers: JSON.stringify({
          Authorization: appKey || "[Your API KEY]",
        }),
        body: JSON.stringify(initialBody),
      },
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(() => {
      create(values)
        .then(({ message, ok }) => {
          if (ok) {
            form.reset();

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
  const body = form.watch("request.body");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"blue"} size={"sm"}>
          {t("sendMail.label")}
        </Button>
      </SheetTrigger>
      <SheetContent
        side={"right"}
        className="lg:max-w-6xl w-full overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>{t("sendMail.title")}</SheetTitle>
          <SheetDescription>{t("sendMail.description")}</SheetDescription>
        </SheetHeader>

        <div className="flex gap-x-4 items-end">
          <div className="flex-1 lg:block hidden">
            <div className="text-md font-semibold mb-2">Preview Email</div>
            <div className="border rounded-lg p-3">
              <ScheduleEmailTemplate initialBody={initialBody} body={body} />
            </div>
          </div>
          <div className="lg:w-[600px] w-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 my-4"
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
                  name="cron"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>{tSchema("cron.label")}</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-4 gap-2">
                          <div className="col-span-3">
                            <Input
                              placeholder={tSchema("cron.placeholder")}
                              value={field.value || undefined}
                              onChange={field.onChange}
                              disabled={isPending}
                            />
                          </div>
                          <ScheduleSelectCron
                            onChange={field.onChange}
                            placeholder="Custom"
                            defaultValue={field.value || undefined}
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
                          statusBar={false}
                          mainMenuBar={false}
                          askToFormat={false}
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
                <ScheduleEmailSelect disabled={isPending} />
                <FormField
                  control={form.control}
                  name="request.body"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tSchema("request.body.label")}</FormLabel>
                      <FormControl>
                        <JSONEditorReact
                          content={{
                            text: field.value || JSON.stringify(initialBody),
                          }}
                          onChange={(
                            content: Content,
                            previousContent: Content,
                            status: OnChangeStatus
                          ) => {
                            field.onChange(toTextContent(content).text);
                          }}
                          mode={Mode.text}
                          generateSample={() => {
                            field.onChange(JSON.stringify(initialBody));
                          }}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DynamicSheetFooter disabled={isPending} />
              </form>
            </Form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
interface ScheduleEmailTemplateProps {
  body: string | null;
  initialBody: EmailBody;
}
const ScheduleEmailTemplate = ({
  body,
  initialBody,
}: ScheduleEmailTemplateProps) => {
  const tSchema = useTranslations("mails.schema");
  const paramSchema = SendEmailSchema(tSchema);
  const parsedBody = safeParseJSON(body);
  const validatedFields = paramSchema.safeParse(parsedBody);
  if (!validatedFields.success) {
    const [error] = validatedFields.error.errors;
    return (
      <div className="space-y-2">
        <EmailTemplate {...initialBody} isPreview />
        <div className="flex justify-center">
          <span className="text-destructive">{error.message}</span>
        </div>
      </div>
    );
  }
  return <EmailTemplate {...validatedFields.data} isPreview />;
};
interface ScheduleEmailSelectProps {
  disabled?: boolean;
}
const ScheduleEmailSelect = ({ disabled }: ScheduleEmailSelectProps) => {
  const [value, setValue] = useState("");
  const t = useTranslations("schedules.search.select.staff");
  return (
    <div>
      <Label>{t("label")} </Label>
      <div className="flex gap-x-2 items-center">
        <StaffsSelectMultiple
          error={t("error")}
          label={t("placeholder")}
          notFound={t("notFound")}
          disabled={disabled}
          onChange={setValue}
          className="w-full"
        />
        <ClipboardButton value={value} />
      </div>
    </div>
  );
};
