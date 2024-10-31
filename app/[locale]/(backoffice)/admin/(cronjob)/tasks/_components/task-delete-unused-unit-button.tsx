"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TaskSchema } from "@/schemas";
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
import { create } from "@/actions/task";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DatePickerWithTime } from "@/components/form/date-picker-with-time";
import { parseToDate } from "@/lib/utils";
import {
  Content,
  Mode,
  OnChangeStatus,
  toTextContent,
} from "vanilla-jsoneditor";
import { JSONEditorReact } from "@/components/vanila-json-editor";
import { DynamicSheetFooter } from "@/components/dialog/dynamic-sheet";
import { UnitsUnused } from "../../../_components/units-unused";

interface TaskDeleteUnusedUnitButtonProps {
  appKey?: string | undefined;
  appUrl?: string | undefined;
}
export const TaskDeleteUnusedUnitButton = ({
  appKey,
  appUrl,
}: TaskDeleteUnusedUnitButtonProps) => {
  const tSchema = useTranslations("tasks.schema");
  const t = useTranslations("tasks.form");

  const formSchema = TaskSchema(tSchema);
  const [isPending, startTransition] = useTransition();
  const [isOpen, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "delete_unused_unit_task",
      scheduled_for: new Date().toISOString(),
      request: {
        url: `${appUrl || "[Your HOST]"}/en/api/units/delete_unused`,
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
  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant={"destroy"} size={"sm"}>
          {t("destroyUnusedUnit.label")}
        </Button>
      </SheetTrigger>
      <SheetContent
        side={"right"}
        className="lg:max-w-[600px] w-full overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>{t("destroyUnusedUnit.title")}</SheetTitle>
          <SheetDescription>
            {t("destroyUnusedUnit.description")}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 my-4"
          >
            <UnitsUnused />
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

            <DynamicSheetFooter disabled={isPending} />
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
