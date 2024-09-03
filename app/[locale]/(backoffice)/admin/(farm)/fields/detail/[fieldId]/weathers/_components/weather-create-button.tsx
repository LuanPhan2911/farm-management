"use client";

import { create } from "@/actions/weather";
import { UnitsSelectWithQueryClient } from "@/app/[locale]/(backoffice)/admin/_components/units-select";
import { SelectOptions } from "@/components/form/select-options";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { WeatherSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { UnitType, WeatherStatus } from "@prisma/client";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const WeatherCreateButton = () => {
  const tSchema = useTranslations("weathers.schema");
  const t = useTranslations("weathers");
  const formSchema = WeatherSchema(tSchema);
  const [isPending, startTransition] = useTransition();
  const closeRef = useRef<HTMLButtonElement>(null);
  const params = useParams<{
    fieldId: string;
  }>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fieldId: params.fieldId,
    },
  });
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(() => {
      create(values)
        .then(({ message, ok }) => {
          if (ok) {
            form.reset();
            closeRef.current?.click();
            toast.success(message);
          } else {
            toast.error(message);
          }
        })
        .catch((error: Error) => {
          toast.error(t("status.failure.create"));
        });
    });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"sm"} variant={"success"}>
          <Plus className="h-6 w-6 mr-2" />{" "}
          <span className="text-sm font-semibold">
            {t("form.create.label")}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("form.create.title")}</DialogTitle>
          <DialogDescription>{t("form.create.description")}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="temperature.value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("temperature.label")}</FormLabel>
                    <div className="flex gap-x-2">
                      <FormControl>
                        <Input
                          placeholder={tSchema("temperature.placeholder")}
                          {...field}
                          disabled={isPending}
                          type="number"
                        />
                      </FormControl>

                      <FormField
                        control={form.control}
                        name="temperature.unitId"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <UnitsSelectWithQueryClient
                                onChange={field.onChange}
                                placeholder={"Unit"}
                                unitType={UnitType.TEMPERATURE}
                                disabled={isPending}
                                className="w-[7rem]"
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="humidity.value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("humidity.label")}</FormLabel>
                    <div className="flex gap-x-2">
                      <FormControl>
                        <Input
                          placeholder={tSchema("humidity.placeholder")}
                          {...field}
                          disabled={isPending}
                          type="number"
                        />
                      </FormControl>

                      <FormField
                        control={form.control}
                        name="humidity.unitId"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <UnitsSelectWithQueryClient
                                onChange={field.onChange}
                                placeholder={"Unit"}
                                unitType={UnitType.PERCENT}
                                disabled={isPending}
                                className="w-[7rem]"
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="atmosphericPressure.value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {tSchema("atmosphericPressure.label")}
                    </FormLabel>
                    <div className="flex gap-x-2">
                      <FormControl>
                        <Input
                          placeholder={tSchema(
                            "atmosphericPressure.placeholder"
                          )}
                          {...field}
                          disabled={isPending}
                          type="number"
                        />
                      </FormControl>

                      <FormField
                        control={form.control}
                        name="atmosphericPressure.unitId"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <UnitsSelectWithQueryClient
                                onChange={field.onChange}
                                placeholder={"Unit"}
                                unitType={UnitType.ATMOSPHERICPRESSURE}
                                disabled={isPending}
                                className="w-[7rem]"
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rainfall.value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("rainfall.label")}</FormLabel>
                    <div className="flex gap-x-2">
                      <FormControl>
                        <Input
                          placeholder={tSchema("rainfall.placeholder")}
                          {...field}
                          disabled={isPending}
                          type="number"
                        />
                      </FormControl>

                      <FormField
                        control={form.control}
                        name="rainfall.unitId"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <UnitsSelectWithQueryClient
                                onChange={field.onChange}
                                placeholder={"Unit"}
                                unitType={UnitType.RAINFALL}
                                disabled={isPending}
                                className="w-[7rem]"
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("status.label")}</FormLabel>
                  <div className="flex gap-x-2">
                    <FormControl>
                      <SelectOptions
                        label="Select status"
                        onChange={field.onChange}
                        options={Object.keys(WeatherStatus).map((item) => {
                          return {
                            label: item,
                            option: item,
                          };
                        })}
                        disabled={isPending}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary" ref={closeRef}>
                  Close
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
