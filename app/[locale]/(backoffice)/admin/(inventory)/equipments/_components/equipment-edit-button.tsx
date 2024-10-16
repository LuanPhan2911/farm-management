"use client";

import { Button } from "@/components/ui/button";

import { EquipmentSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { edit } from "@/actions/equipment";
import { useParams } from "next/navigation";
import { EquipmentTable } from "@/types";
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
import { EquipmentType, UnitType } from "@prisma/client";
import { SelectOptions } from "@/components/form/select-options";
import { DatePicker } from "@/components/form/date-picker";
import { UnitsSelect } from "../../../_components/units-select";
import { UploadImage } from "@/components/form/upload-image";
import { Link } from "@/navigation";
import { Edit } from "lucide-react";

import { DynamicDialogFooter } from "@/components/dialog/dynamic-dialog";

interface EquipmentEditButtonProps {
  data: EquipmentTable;
  label: string;
}
export const EquipmentEditButton = ({
  data,
  label,
}: EquipmentEditButtonProps) => {
  return (
    <Link
      href={`/admin/equipments/edit/${data.id}`}
      className="w-full"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Button variant={"edit"} size={"sm"} className="w-full">
        <Edit className="w-4 h-4 mr-2" />
        {label}
      </Button>
    </Link>
  );
};

interface EquipmentEditFormProps {
  data: EquipmentTable;
}
export const EquipmentEditForm = ({ data }: EquipmentEditFormProps) => {
  const tSchema = useTranslations("equipments.schema");
  const formSchema = EquipmentSchema(tSchema);
  const [isPending, startTransition] = useTransition();

  const params = useParams<{
    equipmentId: string;
  }>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...data,
    },
  });
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(() => {
      edit(values, params!.equipmentId)
        .then(({ message, ok }) => {
          if (ok) {
            toast.success(message);
          } else {
            toast.error(message);
          }
        })
        .catch((error) => {
          toast.error("Internal error");
        });
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-5xl"
      >
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tSchema("imageUrl.label")}</FormLabel>
              <FormControl>
                <UploadImage
                  defaultValue={field.value}
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

        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tSchema("brand.label")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={tSchema("brand.placeholder")}
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
                    label={tSchema("type.placeholder")}
                    onChange={field.onChange}
                    options={Object.values(EquipmentType).map((item) => {
                      return {
                        label: tSchema(`type.options.${item}`),
                        value: item,
                      };
                    })}
                    defaultValue={field.value}
                    disabled={isPending}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="purchaseDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("purchaseDate.label")}</FormLabel>
                <FormControl>
                  <DatePicker
                    onChange={field.onChange}
                    value={field.value}
                    disabled={isPending}
                    placeholder={tSchema("purchaseDate.placeholder")}
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
              name="purchasePrice.value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("purchasePrice.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tSchema("purchasePrice.placeholder")}
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
            name="purchasePrice.unitId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("purchasePrice.unitId.label")}</FormLabel>
                <FormControl>
                  <UnitsSelect
                    onChange={field.onChange}
                    placeholder={tSchema("purchasePrice.unitId.placeholder")}
                    unitType={UnitType.MONEY}
                    disabled={isPending}
                    className="w-full"
                    errorLabel={tSchema("purchasePrice.unitId.error")}
                    notFound={tSchema("purchasePrice.unitId.notFound")}
                    defaultValue={field.value}
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
                <Textarea
                  placeholder={tSchema("description.placeholder")}
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
            name="energyType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("energyType.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tSchema("energyType.placeholder")}
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
            name="fuelConsumption"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("fuelConsumption.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tSchema("fuelConsumption.placeholder")}
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

        <DynamicDialogFooter disabled={isPending} closeButton={false} />
      </form>
    </Form>
  );
};
