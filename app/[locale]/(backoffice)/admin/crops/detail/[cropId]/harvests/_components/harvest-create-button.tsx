"use client";

import { create } from "@/actions/harvest";
import { DynamicDialogFooter } from "@/components/dialog/dynamic-dialog";
import { Button } from "@/components/ui/button";
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
import { HarvestSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import { Crop, Staff, UnitType } from "@prisma/client";
import { DatePicker } from "@/components/form/date-picker";
import { UnitsSelect } from "@/app/[locale]/(backoffice)/admin/_components/units-select";
import { Input } from "@/components/ui/input";
import { ManagePermission } from "@/types";

interface HarvestCreateButtonProps extends ManagePermission {
  currentStaff: Staff;
  crop: Crop;
}
export const HarvestCreateButton = ({
  currentStaff,
  crop,
  canCreate,
}: HarvestCreateButtonProps) => {
  const tSchema = useTranslations("harvests.schema");
  const t = useTranslations("harvests");
  const formSchema = HarvestSchema(tSchema);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      createdById: currentStaff.id,
      cropId: crop.id,
      harvestDate: new Date(),
      unitId: crop.unitId,
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

  const disabled = isPending || !canCreate;

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={"sm"} variant={"success"} disabled={!canCreate}>
          <Plus className="h-4 w-4 mr-2" />{" "}
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
            <FormField
              control={form.control}
              name="harvestDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("harvestDate.label")}</FormLabel>
                  <FormControl>
                    <DatePicker
                      placeholder={tSchema("harvestDate.placeholder")}
                      onChange={field.onChange}
                      value={field.value}
                      disabled={disabled}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tSchema("value.label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={tSchema("value.placeholder")}
                          value={field.value ?? undefined}
                          onChange={field.onChange}
                          disabled={disabled}
                          type="number"
                          max={100_000}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="unitId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSchema("unitId.label")}</FormLabel>
                    <FormControl>
                      <UnitsSelect
                        onChange={field.onChange}
                        placeholder={tSchema("unitId.placeholder")}
                        unitType={UnitType.WEIGHT}
                        disabled={true}
                        error={tSchema("unitId.error")}
                        notFound={tSchema("unitId.notFound")}
                        defaultValue={field.value}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DynamicDialogFooter disabled={disabled} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
