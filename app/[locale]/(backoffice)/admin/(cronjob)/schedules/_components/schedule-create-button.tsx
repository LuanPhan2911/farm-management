"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { z } from "zod";
import { ScheduleSchema } from "@/schemas";
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
import { useTransition } from "react";
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
import { generateCronExplanation } from "@/lib/utils";
import {
  Content,
  Mode,
  OnChangeStatus,
  toTextContent,
} from "vanilla-jsoneditor";
import { JSONEditorReact } from "@/components/vanila-json-editor";
import { DynamicSheetFooter } from "@/components/dialog/dynamic-sheet";
import { Textarea } from "@/components/ui/textarea";
import { ScheduleSelectCron } from "../../../_components/schedule-select-cron";

interface ScheduleCreateButtonProps {
  appKey?: string | undefined;
  appUrl?: string | undefined;
}
export const ScheduleCreateButton = ({
  appKey,
  appUrl,
}: ScheduleCreateButtonProps) => {
  const tSchema = useTranslations("schedules.schema");
  const t = useTranslations("schedules.form");

  const formSchema = ScheduleSchema(tSchema);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: null,
      cron: "",
      request: {
        url: `${appUrl}/en/api/[Your Route]`,
        headers: JSON.stringify({
          Authorization: appKey || "[Your API KEY]",
        }),
        body: "",
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
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size={"sm"} variant={"success"}>
          <Plus className="h-4 w-4 mr-2" />{" "}
          <span className="text-sm font-semibold">{t("create.label")}</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side={"right"}
        className="lg:max-w-[600px] w-full overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>{t("create.title")}</SheetTitle>
          <SheetDescription>{t("create.description")}</SheetDescription>
        </SheetHeader>

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
                    <div className="text-sm font-medium">
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
                      statusBar={false}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <DynamicSheetFooter disabled={isPending} />
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
