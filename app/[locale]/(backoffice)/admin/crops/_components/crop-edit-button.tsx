"use client";
import { DynamicDialogFooter } from "@/components/dialog/dynamic-dialog";
import { CropLearnedLessonsSchema, CropSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { CropStatus, UnitType } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
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
import { Input } from "@/components/ui/input";

import { CropTable } from "@/types";
import { UnitsSelect } from "@/app/[locale]/(backoffice)/admin/_components/units-select";
import { edit, editLearnedLessons } from "@/actions/crop";
import { PlantsSelect } from "@/app/[locale]/(backoffice)/admin/_components/plants-select";
import { DatePickerWithRange } from "@/components/form/date-picker-with-range";
import { DateRange } from "react-day-picker";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import { SelectOptions } from "@/components/form/select-options";
import { FieldsSelect } from "../../_components/fields-select";
import { canUpdateCropStatus } from "@/lib/permission";
import { Tiptap } from "@/components/tiptap";

interface CropEditFormProps {
  data: CropTable;
}

export const CropEditForm = ({ data }: CropEditFormProps) => {
  const tSchema = useTranslations("crops.schema");

  const formSchema = CropSchema(tSchema);

  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...data,
    },
  });
  const { isSuperAdmin } = useCurrentStaffRole();
  const canEdit = isSuperAdmin && canUpdateCropStatus(data.status);

  const endDate = form.watch("endDate");

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(() => {
      edit(values, data.id)
        .then(({ message, ok }) => {
          if (ok) {
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tSchema("name.label")}</FormLabel>

              <FormControl>
                <Input
                  value={field.value ?? undefined}
                  onChange={field.onChange}
                  placeholder={tSchema("name.placeholder")}
                  disabled={isPending || !canEdit}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid lg:grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("startDate.label")}</FormLabel>
                <FormControl>
                  <DatePickerWithRange
                    placeholder={tSchema("startDate.placeholder")}
                    handleChange={(dateRange: DateRange | undefined) => {
                      if (!dateRange || !dateRange.from) {
                        return;
                      }
                      form.setValue("startDate", dateRange.from);
                      form.setValue("endDate", dateRange.to);
                    }}
                    date={{
                      from: field.value,
                      to: endDate || undefined,
                    }}
                    disabled={isPending || !canEdit}
                    className="lg:w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("status.label")}</FormLabel>

                <FormControl>
                  <SelectOptions
                    options={Object.values(CropStatus).map((item) => {
                      return {
                        label: tSchema(`status.options.${item}`),
                        value: item,
                      };
                    })}
                    placeholder={tSchema("status.placeholder")}
                    defaultValue={field.value}
                    onChange={field.onChange}
                    disabled={isPending || !canEdit}
                    disabledValues={[CropStatus.FINISH, CropStatus.NEW]}
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
            name="plantId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("plantId.label")}</FormLabel>

                <FormControl>
                  <PlantsSelect
                    error={tSchema("plantId.error")}
                    placeholder={tSchema("plantId.placeholder")}
                    notFound={tSchema("plantId.notFound")}
                    onChange={field.onChange}
                    defaultValue={field.value}
                    disabled={true}
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
                    error={tSchema("fieldId.error")}
                    placeholder={tSchema("fieldId.placeholder")}
                    notFound={tSchema("fieldId.notFound")}
                    onChange={field.onChange}
                    disabled={true}
                    defaultValue={field.value}
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
            name="unitId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("unitId.label")}</FormLabel>
                <FormControl>
                  <UnitsSelect
                    onChange={field.onChange}
                    placeholder={tSchema("unitId.placeholder")}
                    unitType={UnitType.WEIGHT}
                    disabled={isPending || !canEdit}
                    error={tSchema("unitId.error")}
                    notFound={tSchema("unitId.notFound")}
                    defaultValue={field.value}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="estimatedYield"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("estimatedYield.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tSchema("estimatedYield.placeholder")}
                    value={field.value ?? undefined}
                    onChange={field.onChange}
                    disabled={isPending || !canEdit}
                    type="number"
                    min={0}
                    max={1_000_000_000}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="actualYield"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("actualYield.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tSchema("actualYield.placeholder")}
                    value={field.value ?? undefined}
                    onChange={field.onChange}
                    disabled={isPending || !canEdit}
                    type="number"
                    min={0}
                    max={1_000_000_000}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DynamicDialogFooter
          disabled={isPending || !canEdit}
          closeButton={false}
        />
      </form>
    </Form>
  );
};

interface CropEditLearnedLessonProps {
  data: CropTable;
}
export const CropEditLearnedLesson = ({ data }: CropEditLearnedLessonProps) => {
  const tSchema = useTranslations("crops.schema");

  const formSchema = CropLearnedLessonsSchema(tSchema);

  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      learnedLessons: data.learnedLessons,
    },
  });
  const { isSuperAdmin } = useCurrentStaffRole();
  const canEdit = isSuperAdmin && canUpdateCropStatus(data.status);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(() => {
      editLearnedLessons(values, data.id)
        .then(({ message, ok }) => {
          if (ok) {
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="learnedLessons"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tSchema("learnedLessons.label")}</FormLabel>

              <FormControl>
                <Tiptap
                  value={field.value || ""}
                  onChange={field.onChange}
                  disabled={isPending || !canEdit}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <DynamicDialogFooter
          disabled={isPending || !canEdit}
          closeButton={false}
        />
      </form>
    </Form>
  );
};
