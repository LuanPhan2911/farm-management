"use client";

import { Button } from "@/components/ui/button";
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
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { OrgsSelect } from "../../../_components/orgs-select";
import { UnitsSelect } from "../../../_components/units-select";
import { toast } from "sonner";
import { create } from "@/actions/field";
import { SoilType, UnitType } from "@prisma/client";
import { SelectOptions } from "@/components/form/select-options";
import { DynamicDialogFooter } from "@/components/dialog/dynamic-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@clerk/nextjs";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
interface FieldCreateButtonProps {}
export const FieldCreateButton = ({}: FieldCreateButtonProps) => {
  const { orgId, has } = useAuth();

  const t = useTranslations("fields.form");
  const tSchema = useTranslations("fields.schema");
  const formSchema = FieldSchema(tSchema);
  const [isPending, startTransition] = useTransition();
  const [isOpen, setOpen] = useState(false);
  const { isSuperAdmin } = useCurrentStaffRole();
  const canManageField =
    has?.({ permission: "org:field:manage" }) || isSuperAdmin;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      orgId,
    },
  });
  useEffect(() => {
    form.setValue("orgId", orgId);
  }, [orgId, form]);
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(() => {
      create(values)
        .then(({ message, ok }) => {
          if (ok) {
            toast.success(message);
            setOpen(false);
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
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"success"} size={"sm"} disabled={!canManageField}>
          <Plus className="mr-2" />
          {t("create.label")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>{t("create.title")}</DialogTitle>
          <DialogDescription>{t("create.description")}</DialogDescription>
        </DialogHeader>
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
                      placeholder={tSchema("name.placeholder")}
                      value={field.value ?? undefined}
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
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("location.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tSchema("location.placeholder")}
                      value={field.value ?? undefined}
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
                        disabled={isPending}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
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
                        disabled={isPending}
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
                        disabled={isPending}
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
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
                      disabled={isPending}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tSchema("note.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={tSchema("note.placeholder")}
                      value={field.value ?? undefined}
                      onChange={field.onChange}
                      disabled={isPending}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <DynamicDialogFooter disabled={isPending} closeButton={false} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
