"use client";

import { create } from "@/actions/activity";
import { DynamicDialogFooter } from "@/components/dialog/dynamic-dialog";
import { DatePickerWithTime } from "@/components/form/date-picker-with-time";
import { SelectOptions } from "@/components/form/select-options";

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
import { ActivitySchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActivityPriority, Staff } from "@prisma/client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useRouterWithRole } from "@/hooks/use-router-with-role";
import { LinkButton } from "@/components/buttons/link-button";
import { CropsSelect } from "../../_components/crops-select";
import { useAuth } from "@clerk/nextjs";
import { StaffsSelectMultiple } from "../../_components/staffs-select";

export const ActivityCreateButton = () => {
  const t = useTranslations("activities.form");
  return (
    <LinkButton
      href="activities/create"
      label={t("create.label")}
      icon={Plus}
      variant={"success"}
    />
  );
};

interface ActivityCreateFormProps {
  currentStaff: Staff;
}
export const ActivityCreateForm = ({
  currentStaff,
}: ActivityCreateFormProps) => {
  const tSchema = useTranslations("activities.schema");
  const formSchema = ActivitySchema(tSchema);
  const [isPending, startTransition] = useTransition();
  const router = useRouterWithRole();
  const { orgId } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      status: "NEW",
      priority: "LOW",
      createdById: currentStaff.id,
      activityDate: new Date(),
      estimatedDuration: "1 day",
      actualDuration: "1 day",
    },
  });
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(() => {
      create(values)
        .then(({ message, ok }) => {
          if (ok) {
            toast.success(message);
            router.push("activities");
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
                    disabled={isPending}
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
                    disabled={isPending}
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
                    orgId={orgId}
                    defaultValue={field.value}
                    onChange={field.onChange}
                    error={tSchema("cropId.error")}
                    notFound={tSchema("cropId.notFound")}
                    placeholder={tSchema("cropId.placeholder")}
                    disabled={isPending}
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
                    disabled={isPending}
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
                    disabled={isPending}
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
                    disabled={isPending}
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
                    disabled={isPending}
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
                  disabled={isPending}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <DynamicDialogFooter disabled={isPending} closeButton={false} />
      </form>
    </Form>
  );
};
