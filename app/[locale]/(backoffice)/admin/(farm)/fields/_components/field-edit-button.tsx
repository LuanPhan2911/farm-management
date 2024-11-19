"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FieldSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { OrgsSelect } from "../../../_components/orgs-select";
import { UnitsSelect } from "../../../_components/units-select";
import { toast } from "sonner";
import { edit } from "@/actions/field";
import { useParams } from "next/navigation";
import { FieldTable } from "@/types";
import { SoilType, UnitType } from "@prisma/client";
import { SelectOptions } from "@/components/form/select-options";

import { DynamicDialogFooter } from "@/components/dialog/dynamic-dialog";
import { useAuth } from "@clerk/nextjs";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import { Textarea } from "@/components/ui/textarea";

interface FieldEditFormProps {
  data: FieldTable;
}
export const FieldEditForm = ({ data }: FieldEditFormProps) => {
  const tSchema = useTranslations("fields.schema");
  const formSchema = FieldSchema(tSchema);
  const [isPending, startTransition] = useTransition();
  const { isSuperAdmin } = useCurrentStaffRole();
  const { has, orgId } = useAuth();

  const params = useParams<{
    fieldId: string;
  }>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...data,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(() => {
      edit(values, params!.fieldId)
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

  //edit field: manage field org || (field.orgId=null && isSuperadmin)

  const hasPermission =
    has?.({ permission: "org:field:manage" }) && data.orgId === orgId;
  const canManageField = hasPermission || isSuperAdmin;
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-6xl"
      >
        <div className="grid lg:grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("name.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tSchema("name.placeholder")}
                    value={field.value ?? undefined}
                    onChange={field.onChange}
                    disabled={isPending || !canManageField}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="orgId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("orgId.label")}</FormLabel>
                <FormControl>
                  <OrgsSelect
                    defaultValue={field.value ?? undefined}
                    onChange={field.onChange}
                    error={tSchema("orgId.error")}
                    placeholder={tSchema("orgId.placeholder")}
                    notFound={tSchema("orgId.notFound")}
                    disabled={isPending || !canManageField}
                    appearance={{
                      button: "lg:w-full",
                      content: "lg:w-[480px]",
                    }}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="soilType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("soilType.label")}</FormLabel>
                <FormControl>
                  <SelectOptions
                    placeholder={tSchema("soilType.placeholder")}
                    onChange={field.onChange}
                    options={Object.values(SoilType).map((item) => {
                      return {
                        label: tSchema(`soilType.options.${item}`),
                        value: item,
                      };
                    })}
                    disabled={isPending || !canManageField}
                    defaultValue={field.value}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="shape"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("shape.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={tSchema("shape.placeholder")}
                    value={field.value ?? undefined}
                    onChange={field.onChange}
                    disabled={isPending || !canManageField}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="unitId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("unitId.label")}</FormLabel>
                <FormControl>
                  <UnitsSelect
                    defaultValue={field.value}
                    unitType={UnitType.LENGTH}
                    onChange={field.onChange}
                    placeholder={tSchema("unitId.placeholder")}
                    error={tSchema("unitId.error")}
                    notFound={tSchema("unitId.notFound")}
                    disabled={isPending || !canManageField}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="area"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("area.label")}</FormLabel>

                <FormControl>
                  <Input
                    value={field.value ?? undefined}
                    onChange={field.onChange}
                    type="number"
                    placeholder={tSchema("area.placeholder")}
                    disabled={isPending || !canManageField}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tSchema("note.label")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={tSchema("note.placeholder")}
                  value={field.value ?? undefined}
                  onChange={field.onChange}
                  disabled={isPending || !canManageField}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <DynamicDialogFooter
          disabled={isPending || !canManageField}
          closeButton={false}
        />
      </form>
    </Form>
  );
};
