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
import { ActivityTable } from "@/types";
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
import { StaffsSelectMultiple } from "../../_components/staffs-select";
import { DatePickerWithTime } from "@/components/form/date-picker-with-time";
import { CropsSelect } from "../../_components/crops-select";
import { useAuth } from "@clerk/nextjs";

interface ActivityEditFormProps {
  data: ActivityTable;
  disabled?: boolean;
}
export const ActivityEditForm = ({ data, disabled }: ActivityEditFormProps) => {
  const tSchema = useTranslations("activities.schema");
  const formSchema = ActivitySchema(tSchema);
  const [isPending, startTransition] = useTransition();
  const { orgId } = useAuth();

  const params = useParams<{
    activityId: string;
  }>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...data,
      assignedTo: data.assignedTo.map((item) => item.staffId),
    },
  });

  const canEdit = !disabled;
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
        <div className="grid lg:grid-cols-2 gap-2">
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
                    disabled={isPending || !canEdit}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
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
                    disabled={isPending || !canEdit}
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
            name="cropId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("cropId.label")}</FormLabel>
                <FormControl>
                  <CropsSelect
                    defaultValue={field.value}
                    onChange={field.onChange}
                    error={tSchema("cropId.error")}
                    notFound={tSchema("cropId.notFound")}
                    placeholder={tSchema("cropId.placeholder")}
                    disabled={true}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="assignedTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("assignedTo.label")}</FormLabel>
                <FormControl>
                  <StaffsSelectMultiple
                    orgId={orgId}
                    onChange={field.onChange}
                    defaultValue={field.value}
                    error={tSchema("assignedTo.error")}
                    placeholder={tSchema("assignedTo.placeholder")}
                    notFound={tSchema("assignedTo.notFound")}
                    disabled={isPending || !canEdit}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid lg:grid-cols-4 gap-2">
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
                    disabled={isPending || !canEdit}
                    disabledValues={[
                      ActivityStatus.CANCELLED,
                      ActivityStatus.COMPLETED,
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
                    disabled={isPending || !canEdit}
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
                    disabled={isPending || !canEdit}
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
                    disabled={isPending || !canEdit}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
                  disabled={isPending || !canEdit}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <DynamicDialogFooter
          disabled={isPending || !canEdit}
          closeButton={false}
        />
      </form>
    </Form>
  );
};
