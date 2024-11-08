"use client";

import { create } from "@/actions/activity";
import { DynamicDialogFooter } from "@/components/dialog/dynamic-dialog";
import { DatePickerWithTime } from "@/components/form/date-picker-with-time";
import { SelectOptions } from "@/components/form/select-options";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { ActivityPriority, ActivityStatus } from "@prisma/client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { CropsSelect } from "../../_components/crops-select";
import { useAuth } from "@clerk/nextjs";
import { StaffsSelectMultiple } from "../../_components/staffs-select";
import { CategoriesSelect } from "../../_components/categories-select";
import { Button } from "@/components/ui/button";
import { useCurrentStaff } from "@/hooks/use-current-staff";
import { useParams } from "next/navigation";

export const ActivityCreateButton = () => {
  const t = useTranslations("activities.form");

  const tSchema = useTranslations("activities.schema");
  const formSchema = ActivitySchema(tSchema);
  const [isPending, startTransition] = useTransition();

  const { orgId } = useAuth();
  const [isOpen, setOpen] = useState(false);
  const { currentStaff } = useCurrentStaff();
  const params = useParams<{ cropId: string }>()!;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      status: "NEW",
      priority: "LOW",
      activityDate: new Date(),
      estimatedDuration: 1,
      cropId: params.cropId,
    },
  });
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(() => {
      create(values)
        .then(({ message, ok }) => {
          if (ok) {
            toast.success(message);
            setOpen(false);
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
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={"sm"} variant={"success"} disabled={isPending}>
          <Plus className="h-4 w-4 mr-2" />{" "}
          <span className="text-sm font-semibold">{t("create.label")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl overflow-y-auto max-h-screen">
        <DialogHeader>
          <DialogTitle>{t("create.title")}</DialogTitle>
          <DialogDescription>{t("create.description")}</DialogDescription>
        </DialogHeader>
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
                      <div className="grid grid-cols-4 gap-2">
                        <div className="col-span-3">
                          <Input
                            placeholder={tSchema("name.placeholder")}
                            value={field.value ?? undefined}
                            onChange={field.onChange}
                            disabled={isPending}
                          />
                        </div>
                        <CategoriesSelect
                          error={tSchema("name.select.error")}
                          notFound={tSchema("name.select.notFound")}
                          placeholder={tSchema("name.select.placeholder")}
                          type="ACTIVITY"
                          disabled={isPending}
                          onChange={field.onChange}
                          valueKey="name"
                          hidden
                        />
                      </div>
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
                        defaultValue={field.value}
                        onChange={field.onChange}
                        error={tSchema("cropId.error")}
                        notFound={tSchema("cropId.notFound")}
                        placeholder={tSchema("cropId.placeholder")}
                        disabled={isPending || !!params.cropId}
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
                        disabled={isPending}
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
                        type="number"
                        min={1}
                        max={100}
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
                        type="number"
                        min={1}
                        max={100}
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
      </DialogContent>
    </Dialog>
  );
};
