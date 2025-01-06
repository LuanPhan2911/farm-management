"use client";
import { DynamicDialogFooter } from "@/components/dialog/dynamic-dialog";
import { CropLearnedLessonsSchema, StoreSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Staff, Store, UnitType } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

import { CropTable, ManagePermission } from "@/types";
import { editLearnedLessons } from "@/actions/crop";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";

import { canUpdateCropStatus } from "@/lib/permission";
import { Tiptap } from "@/components/tiptap";
import { upsert } from "@/actions/store";
import { UploadImage } from "@/components/form/upload-image";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { UnitsSelect } from "@/app/[locale]/(backoffice)/admin/_components/units-select";

interface StoreUpsertFormProps extends ManagePermission {
  data: Store | null;
  crop: CropTable;
  currentStaff: Staff;
}

export const StoreUpsertForm = ({
  data,
  crop,
  currentStaff,
  canEdit,
}: StoreUpsertFormProps) => {
  const tSchema = useTranslations("stores.schema");
  const formSchema = StoreSchema(tSchema);

  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...data,
      name: data?.name ?? crop.plant.name,
      address: data?.address ?? crop.field.location ?? undefined,
      phoneNumber: data?.phoneNumber ?? currentStaff.phone ?? undefined,
      cropId: data?.cropId ?? crop.id,
    },
  });

  const disabled = isPending || !canEdit;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(() => {
      upsert(values, data?.id)
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
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tSchema("imageUrl.label")}</FormLabel>
              <FormDescription>
                {tSchema("imageUrl.placeholder")}
              </FormDescription>
              <FormControl>
                <UploadImage
                  onChange={field.onChange}
                  defaultValue={field.value}
                  disabled={disabled}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
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
                  disabled={disabled}
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
                <Textarea
                  value={field.value ?? undefined}
                  onChange={field.onChange}
                  placeholder={tSchema("description.placeholder")}
                  disabled={disabled}
                  rows={5}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("address.label")}</FormLabel>

                <FormControl>
                  <Input
                    placeholder={tSchema("address.placeholder")}
                    value={field.value ?? undefined}
                    onChange={field.onChange}
                    disabled={disabled}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("phoneNumber.label")}</FormLabel>

                <FormControl>
                  <Input
                    placeholder={tSchema("phoneNumber.placeholder")}
                    value={field.value ?? undefined}
                    onChange={field.onChange}
                    disabled={disabled}
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("price.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tSchema("price.placeholder")}
                      value={field.value ?? undefined}
                      onChange={field.onChange}
                      disabled={disabled}
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
            name="unitId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("unitId.label")}</FormLabel>
                <FormControl>
                  <UnitsSelect
                    onChange={field.onChange}
                    placeholder={tSchema("unitId.placeholder")}
                    unitType={UnitType.WEIGHT}
                    disabled={disabled}
                    className="w-full"
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
        <div className="grid lg:grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="isFeature"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={disabled}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{tSchema("isFeature.label")}</FormLabel>
                  <FormDescription>
                    {tSchema("isFeature.description")}
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isPublic"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={disabled}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{tSchema("isPublic.label")}</FormLabel>
                  <FormDescription>
                    {tSchema("isPublic.description")}
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <DynamicDialogFooter disabled={disabled} closeButton={false} />
      </form>
    </Form>
  );
};

interface CropEditLearnedLessonProps {
  data: CropTable;
}
export const CropEditLearnedLesson = ({ data }: CropEditLearnedLessonProps) => {
  const tSchema = useTranslations("stores.schema");

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
