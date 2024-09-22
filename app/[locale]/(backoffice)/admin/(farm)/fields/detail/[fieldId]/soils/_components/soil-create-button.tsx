"use client";

import { create } from "@/actions/soil";
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
import { SoilSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { UnitType } from "@prisma/client";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const SoilCreateButton = () => {
  const tSchema = useTranslations("soils.schema");
  const t = useTranslations("soils");
  const formSchema = SoilSchema(tSchema);
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
    console.log(values);

    // startTransition(() => {
    //   create(values)
    //     .then(({ message, ok }) => {
    //       if (ok) {
    //         form.reset();
    //         closeRef.current?.click();
    //         toast.success(message);
    //       } else {
    //         toast.error(message);
    //       }
    //     })
    //     .catch((error: Error) => {
    //       toast.error(t("status.failure.create"));
    //     });
    // });
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="ph"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("ph.label")}</FormLabel>
                  <div className="flex gap-x-2">
                    <FormControl>
                      <Input
                        placeholder={tSchema("ph.placeholder")}
                        {...field}
                        disabled={isPending}
                        type="number"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid lg:grid-cols-2 gap-2">
              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-3">
                  <FormField
                    control={form.control}
                    name="moisture.value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{tSchema("moisture.label")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={tSchema("moisture.placeholder")}
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
                  name="moisture.unitId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tSchema("moisture.unitId.label")}</FormLabel>
                      <FormControl>
                        <UnitsSelectWithQueryClient
                          onChange={field.onChange}
                          placeholder={tSchema("moisture.unitId.placeholder")}
                          unitType={UnitType.PERCENT}
                          disabled={isPending}
                          className="w-full"
                          errorLabel={tSchema("moisture.unitId.error")}
                          notFound={tSchema("moisture.unitId.notFound")}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="nutrientUnitId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("nutrientUnitId.label")}</FormLabel>
                    <div className="flex gap-x-2">
                      <FormControl>
                        <UnitsSelectWithQueryClient
                          onChange={field.onChange}
                          placeholder={tSchema("nutrientUnitId.placeholder")}
                          unitType={UnitType.NUTRIENT}
                          disabled={isPending}
                          className="w-full"
                          errorLabel={tSchema("nutrientUnitId.error")}
                          notFound={tSchema("nutrientUnitId.notFound")}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid lg:grid-cols-3 gap-2">
              <FormField
                control={form.control}
                name="nutrientNitrogen"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("nutrientNitrogen.label")}</FormLabel>
                    <div className="flex gap-x-2">
                      <FormControl>
                        <Input
                          placeholder={tSchema("nutrientNitrogen.placeholder")}
                          {...field}
                          disabled={isPending}
                          type="number"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nutrientPhosphorus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("nutrientPhosphorus.label")}</FormLabel>
                    <div className="flex gap-x-2">
                      <FormControl>
                        <Input
                          placeholder={tSchema(
                            "nutrientPhosphorus.placeholder"
                          )}
                          {...field}
                          disabled={isPending}
                          type="number"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nutrientPotassium"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("nutrientPotassium.label")}</FormLabel>
                    <div className="flex gap-x-2">
                      <FormControl>
                        <Input
                          placeholder={tSchema("nutrientPotassium.placeholder")}
                          {...field}
                          disabled={isPending}
                          type="number"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
