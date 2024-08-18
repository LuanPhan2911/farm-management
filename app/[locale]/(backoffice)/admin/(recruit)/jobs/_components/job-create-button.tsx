"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tiptap } from "@/components/tiptap";
import { DatePicker } from "@/components/date-picker";
import { SelectOptions } from "@/components/select-options";
import { Gender, JobExperience, JobWorkingState } from "@prisma/client";
import { RadioOptions } from "@/components/radio-options";

import { addDays } from "date-fns";
import { useRouter } from "@/navigation";

export const JobCreateButton = () => {
  const tButton = useTranslations("jobs.button");

  return (
    <Link href={"/admin/jobs/create"}>
      <Button>
        <Plus className="h-6 w-6 mr-2" />{" "}
        <span className="text-sm font-semibold">{tButton("create")}</span>
      </Button>
    </Link>
  );
};
export const JobCreateForm = () => {
  const tSchema = useTranslations("jobs.schema");

  const tCreate = useTranslations("jobs.form.create");
  const tForm = useTranslations("form");

  const formSchema = JobSchema(tSchema);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      experience: JobExperience.NONE,
      gender: Gender.MALE,
      workingState: JobWorkingState.FULL_TIME,
      expiredAt: new Date(),
      quantity: 1,
      requirement: "",
      rights: "",
      wage: "",
      workingTime: "",
    },
  });
  const router = useRouter();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(() => {
      create(values)
        .then(({ message, ok }) => {
          if (ok) {
            router.push("/admin/jobs");
            form.reset();
            toast.success(message);
          } else {
            toast.error(message);
          }
        })
        .catch((error: Error) => {
          toast.error(tForm("error"));
        });
    });
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>{tCreate("title")}</CardTitle>
        <CardDescription>{tCreate("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 max-w-4xl"
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
                        value={field.value}
                        options={Object.values(JobExperience).map((value) => {
                          return {
                            label: tSchema(`experience.options.${value}`),
                            option: value,
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
                            option: value,
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
                            option: value,
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
              <Button type="button" variant="secondary">
                {tForm("button.close")}
              </Button>
              <Button type="submit" disabled={isPending}>
                {tForm("button.submit")}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
