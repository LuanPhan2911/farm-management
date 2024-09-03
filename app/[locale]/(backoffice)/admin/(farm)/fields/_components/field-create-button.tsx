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
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { OrgsSelectWithQueryClient } from "../../../_components/orgs-select";
import { UnitsSelectWithQueryClient } from "../../../_components/units-select";
import { Link, useRouter } from "@/navigation";
import { toast } from "sonner";
import { create } from "@/actions/field";
import { UnitType } from "@prisma/client";

export const FieldCreateButton = () => {
  return (
    <Link href={"/admin/fields/create"}>
      <Button variant={"success"} size={"sm"}>
        <Plus className="mr-2" /> Create Field
      </Button>
    </Link>
  );
};
export const FieldCreateForm = () => {
  const tSchema = useTranslations("fields.schema");
  const formSchema = FieldSchema(tSchema);
  const t = useTranslations("fields");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(() => {
      create(values)
        .then(({ message, ok }) => {
          if (ok) {
            toast.success(message);
            router.push("/admin/fields");
          } else {
            toast.error(message);
          }
        })
        .catch((error) => {
          toast.error(t("status.failure.create"));
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
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tSchema("location.label")}</FormLabel>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="orgId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("orgId.label")}</FormLabel>
                <FormControl>
                  <OrgsSelectWithQueryClient
                    defaultValue={field.value}
                    onChange={field.onChange}
                    errorLabel="Something went wrong went load organizations"
                    label="Select organization..."
                    notFound="Organization not found"
                    disabled={isPending}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="unitId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("unitId.label")}</FormLabel>
                <FormControl>
                  <FormField
                    control={form.control}
                    name="unitId"
                    render={({ field }) => (
                      <UnitsSelectWithQueryClient
                        defaultValue={field.value}
                        unitType={UnitType.LENGTH}
                        onChange={field.onChange}
                        placeholder="Select unit..."
                        disabled={isPending}
                      />
                    )}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("height.label")}</FormLabel>

                <FormControl>
                  <Input {...field} type="number" placeholder="Height" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="width"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tSchema("width.label")}</FormLabel>

                <FormControl>
                  <Input {...field} type="number" placeholder="Width" />
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
                  <Input {...field} type="number" placeholder="Area" />
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
                  {...field}
                  disabled={isPending}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          Submit
        </Button>
      </form>
    </Form>
  );
};
