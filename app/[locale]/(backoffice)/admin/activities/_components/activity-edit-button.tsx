"use client";

import { ActivitySchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { edit } from "@/actions/activity";
import { useParams } from "next/navigation";
import { ActivityTable, activityUpdateStatus } from "@/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { SelectOptions } from "@/components/form/select-options";

import { DynamicDialogFooter } from "@/components/dialog/dynamic-dialog";
import { ActivityPriority, ActivityStatus } from "@prisma/client";
import { FieldsSelect } from "../../_components/fields-select";
import { StaffsSelect } from "../../_components/staffs-select";
import { DatePickerWithTime } from "@/components/form/date-picker-with-time";
import { canUpdateActivityStatus } from "@/lib/permission";

interface ActivityEditFormProps {
  data: ActivityTable;
  disabled?: boolean;
}
export const ActivityEditForm = ({ data, disabled }: ActivityEditFormProps) => {
  const tSchema = useTranslations("activities.schema");
  const formSchema = ActivitySchema(tSchema);

  const [isPending, startTransition] = useTransition();

  const params = useParams<{
    activityId: string;
  }>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...data,
    },
  });
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(() => {
      edit(values, params!.activityId)
        .then(({ message, ok }) => {
          if (ok) {
            toast.success(message);
          } else {
            toast.error(message);
          }
        })
        .catch((error) => {
          toast.error("Internal error");
        });
    });
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-6xl"
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
                  value={field.value ?? undefined}
                  onChange={field.onChange}
                  disabled={isPending || disabled}
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
                  disabled={isPending || disabled}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid lg:grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("status.label")}</FormLabel>
                <FormControl>
                  <SelectOptions
                    placeholder={tSchema("status.placeholder")}
                    onChange={field.onChange}
                    options={Object.values(ActivityStatus).map((item) => {
                      return {
                        label: tSchema(`status.options.${item}`),
                        value: item,
                      };
                    })}
                    defaultValue={field.value}
                    disabled={isPending || disabled}
                    disabledValues={[
                      ActivityStatus.COMPLETED,
                      ActivityStatus.CANCELLED,
                    ]}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("priority.label")}</FormLabel>
                <FormControl>
                  <SelectOptions
                    placeholder={tSchema("priority.placeholder")}
                    onChange={field.onChange}
                    options={Object.values(ActivityPriority).map((item) => {
                      return {
                        label: tSchema(`priority.options.${item}`),
                        value: item,
                      };
                    })}
                    defaultValue={field.value}
                    disabled={isPending || disabled}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid lg:grid-cols-3 gap-2">
          <FormField
            control={form.control}
            name="activityDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("activityDate.label")}</FormLabel>
                <FormControl>
                  <DatePickerWithTime
                    placeholder={tSchema("activityDate.placeholder")}
                    onChange={field.onChange}
                    value={field.value}
                    disabledDateRange={{
                      before: new Date(),
                    }}
                    disabled={true}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="estimatedDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("estimatedDuration.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tSchema("estimatedDuration.placeholder")}
                    value={field.value ?? undefined}
                    onChange={field.onChange}
                    disabled={true}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="actualDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("actualDuration.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tSchema("actualDuration.placeholder")}
                    value={field.value ?? undefined}
                    onChange={field.onChange}
                    disabled={isPending || disabled}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid lg:grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="assignedToId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("assignedToId.label")}</FormLabel>
                <FormControl>
                  <StaffsSelect
                    placeholder={tSchema("assignedToId.placeholder")}
                    onChange={field.onChange}
                    defaultValue={field.value}
                    error={tSchema("assignedToId.error")}
                    notFound={tSchema("assignedToId.notFound")}
                    disabled={true}
                    appearance={{
                      button: "lg:w-full h-12",
                      content: "lg:w-[450px]",
                    }}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fieldId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("fieldId.label")}</FormLabel>
                <FormControl>
                  <FieldsSelect
                    defaultValue={field.value}
                    onChange={field.onChange}
                    error={tSchema("fieldId.error")}
                    notFound={tSchema("fieldId.notFound")}
                    placeholder={tSchema("fieldId.placeholder")}
                    disabled={true}
                    appearance={{
                      button: "lg:w-full h-12",
                      content: "lg:w-[450px]",
                    }}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tSchema("note.label")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={tSchema("note.placeholder")}
                  value={field.value ?? undefined}
                  onChange={field.onChange}
                  disabled={isPending || disabled}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <DynamicDialogFooter
          disabled={isPending || disabled}
          closeButton={false}
        />
      </form>
    </Form>
  );
};
