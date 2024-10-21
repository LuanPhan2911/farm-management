"use client";

import { create } from "@/actions/activity";
import { DynamicDialogFooter } from "@/components/dialog/dynamic-dialog";
import { DatePickerWithTime } from "@/components/form/date-picker-with-time";
import { SelectOptions } from "@/components/form/select-options";
import { Button } from "@/components/ui/button";

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
import { Link, useRouter } from "@/navigation";
import { ActivitySchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActivityPriority, Staff } from "@prisma/client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { StaffsSelect } from "../../_components/staffs-select";
import { FieldsSelect } from "../../_components/fields-select";

export const ActivityCreateButton = () => {
  const t = useTranslations("activities.form");
  return (
    <Link href={"/admin/activities/create"}>
      <Button variant={"success"} size={"sm"}>
        <Plus className="mr-2" />
        {t("create.label")}
      </Button>
    </Link>
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
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      status: "NEW",
      priority: "LOW",
      createdById: currentStaff.id,
    },
  });
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(() => {
      create(values)
        .then(({ message, ok }) => {
          if (ok) {
            toast.success(message);
            router.push("/admin/activities");
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
        className="space-y-4 max-w-5xl"
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
            name="actualDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("actualDuration.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tSchema("actualDuration.placeholder")}
                    value={field.value || undefined}
                    onChange={field.onChange}
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
                    disabled={isPending}
                    appearance={{
                      button: "lg:w-full h-15",
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
                    disabled={isPending}
                    appearance={{
                      button: "lg:w-full h-15",
                      content: "lg:w-[450px]",
                    }}
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
                  value={field.value || undefined}
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
