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
import { FieldLocationSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { editLocation } from "@/actions/field";
import { useParams } from "next/navigation";
import { FieldLocationWithLatestCrop, FieldTable } from "@/types";

import { DynamicDialogFooter } from "@/components/dialog/dynamic-dialog";
import { useAuth } from "@clerk/nextjs";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LeafletMapCaller } from "@/components/leaflet/map-caller";
import { getLocationLatLng } from "@/lib/utils";
import _ from "lodash";

interface FieldEditLocationProps {
  data: FieldTable;
  locations: FieldLocationWithLatestCrop[];
}
export const FieldEditLocationForm = ({
  data,
  locations,
}: FieldEditLocationProps) => {
  const tSchema = useTranslations("fields.schema.locations");
  const t = useTranslations("fields.form");
  const formSchema = FieldLocationSchema(tSchema);
  const [isPending, startTransition] = useTransition();
  const { isSuperAdmin } = useCurrentStaffRole();
  const { has, orgId } = useAuth();

  const params = useParams<{
    fieldId: string;
  }>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      latitude: data.latitude,
      location: data.location,
      longitude: data.longitude,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(() => {
      editLocation(values, params!.fieldId)
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

  const centerMap = getLocationLatLng(data.latitude, data.longitude);

  return (
    <div className="grid lg:grid-cols-5 gap-4">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>{t("editLocation.title")}</CardTitle>
          <CardDescription>{t("editLocation.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-4"
            >
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
                        disabled={isPending || !canManageField}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tSchema("latitude.label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={tSchema("latitude.placeholder")}
                          value={field.value ?? undefined}
                          onChange={field.onChange}
                          type="number"
                          className="no-spinners"
                          disabled={isPending || !canManageField}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tSchema("longitude.label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={tSchema("longitude.placeholder")}
                          value={field.value ?? undefined}
                          onChange={field.onChange}
                          type="number"
                          className="no-spinners"
                          disabled={isPending || !canManageField}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <DynamicDialogFooter
                disabled={isPending || !canManageField}
                closeButton={false}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="lg:col-span-3">
        <LeafletMapCaller
          className="h-[500px]"
          onChangeCurrentLocationFn={(value) => {
            const [lat, lng] = value;
            form.setValue("latitude", _.round(lat, 4));
            form.setValue("longitude", _.round(lng, 4));
          }}
          onChangeLocationSelectFn={(value) => {
            form.setValue("location", value);
          }}
          center={centerMap}
          markerLocations={locations}
        />
      </div>
    </div>
  );
};
