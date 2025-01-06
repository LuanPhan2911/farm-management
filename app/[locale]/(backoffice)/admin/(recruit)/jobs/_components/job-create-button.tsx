"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { JobSchema } from "@/schemas";
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
import { create } from "@/actions/job";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tiptap } from "@/components/tiptap";
import { DatePicker } from "@/components/form/date-picker";
import { SelectOptions } from "@/components/form/select-options";
import { Gender, JobExperience, JobWorkingState } from "@prisma/client";
import { RadioOptions } from "@/components/form/radio-options";

import { DynamicDialogFooter } from "@/components/dialog/dynamic-dialog";
import { LinkButton } from "@/components/buttons/link-button";
import { useRouterWithRole } from "@/hooks/use-router-with-role";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";

export const JobCreateButton = () => {
  const t = useTranslations("jobs.form");
  const { isSuperAdmin } = useCurrentStaffRole();

  const canCreate = isSuperAdmin;
  return (
    <LinkButton
      href="jobs/create"
      label={t("create.label")}
      icon={Plus}
      variant={"success"}
      disabled={!canCreate}
    />
  );
};
export const JobCreateForm = () => {
  const tSchema = useTranslations("jobs.schema");
  const formSchema = JobSchema(tSchema);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      wage: "50k/hr",
      workingTime: "8hr/day",
      experience: JobExperience.NONE,
      gender: Gender.MALE,
      workingState: JobWorkingState.FULL_TIME,
      expiredAt: new Date(),
      quantity: 1,
      requirement: "",
      rights: "",
    },
  });
  const router = useRouterWithRole();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(() => {
      create(values)
        .then(({ message, ok }) => {
          if (ok) {
            router.push("jobs");
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
                  disabled={isPending}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid lg:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("quantity.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tSchema("quantity.placeholder")}
                    value={field.value ?? undefined}
                    onChange={field.onChange}
                    disabled={isPending}
                    type="number"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="wage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("wage.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tSchema("wage.placeholder")}
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
            name="workingTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("workingTime.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tSchema("workingTime.placeholder")}
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
        <div className="grid lg:grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="expiredAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("expiredAt.label")}</FormLabel>
                <FormControl>
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isPending}
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
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("experience.label")}</FormLabel>
                <FormControl>
                  <SelectOptions
                    placeholder={tSchema("experience.placeholder")}
                    onChange={field.onChange}
                    disabled={isPending}
                    defaultValue={field.value}
                    options={Object.values(JobExperience).map((value) => {
                      return {
                        label: tSchema(`experience.options.${value}`),
                        value: value,
                      };
                    })}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("gender.label")}</FormLabel>
                <FormControl>
                  <RadioOptions
                    onChange={field.onChange}
                    disabled={isPending}
                    value={field.value}
                    options={Object.values(Gender).map((value) => {
                      return {
                        label: tSchema(`gender.options.${value}`),
                        value: value,
                      };
                    })}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="workingState"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("workingState.label")}</FormLabel>
                <FormControl>
                  <RadioOptions
                    onChange={field.onChange}
                    disabled={isPending}
                    value={field.value}
                    options={Object.values(JobWorkingState).map((value) => {
                      return {
                        label: tSchema(`workingState.options.${value}`),
                        value: value,
                      };
                    })}
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
                <Tiptap
                  value={field.value}
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
          name="requirement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tSchema("requirement.label")}</FormLabel>
              <FormControl>
                <Tiptap
                  value={field.value}
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
          name="rights"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tSchema("rights.label")}</FormLabel>
              <FormControl>
                <Tiptap
                  value={field.value}
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
