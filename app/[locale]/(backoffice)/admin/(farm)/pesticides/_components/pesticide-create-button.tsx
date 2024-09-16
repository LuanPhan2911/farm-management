"use client";

import { create } from "@/actions/pesticide";
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
import { Textarea } from "@/components/ui/textarea";
import { PesticideSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { PesticideType, UnitType, ToxicityLevel } from "@prisma/client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const PesticideCreateButton = () => {
  const tSchema = useTranslations("pesticides.schema");
  const t = useTranslations("pesticides");
  const formSchema = PesticideSchema(tSchema);
  const [isPending, startTransition] = useTransition();
  const closeRef = useRef<HTMLButtonElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
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
      <DialogContent className="max-w-3xl overflow-y-auto max-h-screen">
        <DialogHeader>
          <DialogTitle>{t("form.create.title")}</DialogTitle>
          <DialogDescription>{t("form.create.description")}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
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
            <div className="grid lg:grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("type.label")}</FormLabel>
                    <FormControl>
                      <SelectOptions
                        label={tSchema("type.placeholder")}
                        onChange={field.onChange}
                        options={Object.keys(PesticideType).map((item) => {
                          return {
                            label: tSchema(`type.options.${item}`),
                            value: item,
                          };
                        })}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="toxicityLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("toxicityLevel.label")}</FormLabel>
                    <FormControl>
                      <SelectOptions
                        label={tSchema("toxicityLevel.placeholder")}
                        onChange={field.onChange}
                        options={Object.keys(ToxicityLevel).map((item) => {
                          return {
                            label: tSchema(`toxicityLevel.options.${item}`),
                            value: item,
                          };
                        })}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name="recommendedDosage.value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {tSchema("recommendedDosage.label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={tSchema("recommendedDosage.placeholder")}
                          {...field}
                          disabled={isPending}
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="recommendedDosage.unitId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {tSchema("recommendedDosage.unitId.label")}
                    </FormLabel>
                    <FormControl>
                      <UnitsSelectWithQueryClient
                        onChange={field.onChange}
                        placeholder={tSchema(
                          "recommendedDosage.unitId.placeholder"
                        )}
                        unitType={UnitType.VOLUME}
                        disabled={isPending}
                        className="w-full"
                        errorLabel={tSchema("recommendedDosage.unitId.error")}
                        notFound={tSchema("recommendedDosage.unitId.notFound")}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name="withdrawalPeriod.value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tSchema("withdrawalPeriod.label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={tSchema("withdrawalPeriod.placeholder")}
                          {...field}
                          disabled={isPending}
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="withdrawalPeriod.unitId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {tSchema("withdrawalPeriod.unitId.label")}
                    </FormLabel>
                    <FormControl>
                      <UnitsSelectWithQueryClient
                        onChange={field.onChange}
                        placeholder={tSchema(
                          "withdrawalPeriod.unitId.placeholder"
                        )}
                        unitType={UnitType.DATE}
                        disabled={isPending}
                        className="w-full"
                        errorLabel={tSchema("withdrawalPeriod.unitId.error")}
                        notFound={tSchema("withdrawalPeriod.unitId.notFound")}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="applicationMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("applicationMethod.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tSchema("applicationMethod.placeholder")}
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
              name="ingredient"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("ingredient.label")}</FormLabel>
                  <div className="flex gap-x-2">
                    <FormControl>
                      <Textarea
                        {...field}
                        disabled={isPending}
                        placeholder={tSchema("ingredient.placeholder")}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="manufacturer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("manufacturer.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tSchema("manufacturer.placeholder")}
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
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
