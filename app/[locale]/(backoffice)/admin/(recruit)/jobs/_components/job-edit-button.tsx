"use client";

import { Button } from "@/components/ui/button";
import { JobSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Gender, Job, JobExperience, JobWorkingState } from "@prisma/client";
import { Edit } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { edit } from "@/actions/job";
import { Input } from "@/components/ui/input";
import { useRouter } from "@/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SelectOptions } from "@/components/form/select-options";
import { DatePicker } from "@/components/form/date-picker";
import { addDays } from "date-fns";
import { RadioOptions } from "@/components/form/radio-options";
import { Tiptap } from "@/components/tiptap";
import { useTransition } from "react";
import { JobTable } from "@/types";

interface JobEditButtonProps {
  data: JobTable;
  label: string;
}

export const JobEditButton = ({ data, label }: JobEditButtonProps) => {
  const router = useRouter();
  return (
    <Button
      className="w-full"
      onClick={() => router.push(`/admin/jobs/edit/${data.id}`)}
      size={"sm"}
      variant={"edit"}
    >
      <Edit className="w-6 h-6 mr-2" />
      {label}
    </Button>
  );
};
interface JobEditFormProps {
  job: Job;
}
export const JobEditForm = ({ job }: JobEditFormProps) => {
  const { id, ...other } = job;
  const tSchema = useTranslations("jobs.schema");

  const t = useTranslations("jobs");
  const formSchema = JobSchema(tSchema);

  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...other,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!id) {
      return;
    }
    startTransition(() => {
      edit(values, id)
        .then(({ message, ok }) => {
          if (ok) {
            toast.success(message);
          } else {
            toast.error(message);
          }
        })
        .catch((error: Error) => {
          toast.error(t("status.failure.edit"));
        });
    });
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("form.edit.title")}</CardTitle>
        <CardDescription>{t("form.edit.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 max-w-4xl"
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
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("experience.label")}</FormLabel>
                    <FormControl>
                      <SelectOptions
                        label={tSchema("experience.placeholder")}
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
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("quantity.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={tSchema("quantity.placeholder")}
                        {...field}
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
                name="expiredAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("expiredAt.label")}</FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value}
                        onChange={field.onChange}
                        disabled={isPending}
                        disabledDateRange={(date) => {
                          return date < addDays(new Date(), -1);
                        }}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              name="workingTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("workingTime.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tSchema("workingTime.placeholder")}
                      {...field}
                      disabled={isPending}
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
                      {...field}
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
                    <Tiptap value={field.value} onChange={field.onChange} />
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
                    <Tiptap value={field.value} onChange={field.onChange} />
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
                    <Tiptap value={field.value} onChange={field.onChange} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-x-2 justify-center">
              <Button type="submit" disabled={isPending}>
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
