"use client";

import { create } from "@/actions/pesticide";
import { UnitsSelect } from "@/app/[locale]/(backoffice)/admin/_components/units-select";
import { DynamicDialogFooter } from "@/components/dialog/dynamic-dialog";
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
import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const PesticideCreateButton = () => {
  const tSchema = useTranslations("pesticides.schema");
  const t = useTranslations("pesticides");
  const formSchema = PesticideSchema(tSchema);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
  const [isOpen, setOpen] = useState(false);
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(() => {
      create(values)
        .then(({ message, ok }) => {
          if (ok) {
            form.reset();
            setOpen(false);
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
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={"sm"} variant={"success"}>
          <Plus className="h-4 w-4 mr-2" />{" "}
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
                      value={field.value || undefined}
                      onChange={field.onChange}
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
                        placeholder={tSchema("type.placeholder")}
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
                        placeholder={tSchema("toxicityLevel.placeholder")}
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
                          value={field.value || undefined}
                          onChange={field.onChange}
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
                      <UnitsSelect
                        onChange={field.onChange}
                        placeholder={tSchema(
                          "recommendedDosage.unitId.placeholder"
                        )}
                        unitType={UnitType.VOLUME}
                        disabled={isPending}
                        className="w-full"
                        error={tSchema("recommendedDosage.unitId.error")}
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
                          value={field.value || undefined}
                          onChange={field.onChange}
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
                      <UnitsSelect
                        onChange={field.onChange}
                        placeholder={tSchema(
                          "withdrawalPeriod.unitId.placeholder"
                        )}
                        unitType={UnitType.DATE}
                        disabled={isPending}
                        className="w-full"
                        error={tSchema("withdrawalPeriod.unitId.error")}
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
              name="ingredient"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("ingredient.label")}</FormLabel>
                  <div className="flex gap-x-2">
                    <FormControl>
                      <Textarea
                        value={field.value || undefined}
                        onChange={field.onChange}
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
                      value={field.value || undefined}
                      onChange={field.onChange}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DynamicDialogFooter disabled={isPending} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
