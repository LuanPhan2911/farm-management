"use client";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getLatLng } from "@/lib/utils";
import { FieldLocationSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { LatLngTuple } from "leaflet";
import _ from "lodash";
import { Goal } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { CircleMarker, Popup } from "react-leaflet";
import { z } from "zod";

interface CurrentLocationFormProps {
  currentPosition: LatLngTuple | null;
  goToPositionFn: (value: LatLngTuple) => void;
}
export const CurrentLocationForm = ({
  currentPosition,
  goToPositionFn,
}: CurrentLocationFormProps) => {
  const tSchema = useTranslations("fields.schema.locations");
  const formSchema = FieldLocationSchema(tSchema);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      latitude: undefined,
      longitude: undefined,
    },
  });

  useEffect(() => {
    if (currentPosition !== null) {
      const [lat, lng] = currentPosition;

      form.reset({
        latitude: _.round(lat, 4),
        longitude: _.round(lng, 4),
      });
    }
  }, [currentPosition, form]);
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const { latitude: lat, longitude: lng } = values;
    if (lat && lng) {
      goToPositionFn(getLatLng(lat, lng));
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-center gap-2 w-fit max-w-[250px] h-10"
      >
        <FormField
          control={form.control}
          name="latitude"
          render={({ field }) => (
            <FormItem>
              <Hint asChild label={tSchema("latitude.label")}>
                <FormControl>
                  <Input
                    placeholder={tSchema("latitude.placeholder")}
                    value={field.value ?? undefined}
                    onChange={field.onChange}
                    type="number"
                    className="no-spinners border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </FormControl>
              </Hint>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="longitude"
          render={({ field }) => (
            <FormItem>
              <Hint asChild label={tSchema("longitude.label")}>
                <FormControl>
                  <Input
                    placeholder={tSchema("longitude.placeholder")}
                    value={field.value ?? undefined}
                    onChange={field.onChange}
                    type="number"
                    className="no-spinners border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </FormControl>
              </Hint>
            </FormItem>
          )}
        />
        <Hint asChild label="Go to this coordinates">
          <Button variant={"blue"} size={"sm"} type="submit">
            <Goal className="h-4 w-4" />
          </Button>
        </Hint>
      </form>
    </Form>
  );
};

interface CurrentLocationMarkerProps {
  currentPosition: LatLngTuple | null;
  message?: string;
}
export const CurrentLocationMarker = ({
  currentPosition,
  message,
}: CurrentLocationMarkerProps) => {
  if (!currentPosition) {
    return null;
  }
  const redOptions = { color: "red" };
  return (
    <CircleMarker center={currentPosition} pathOptions={redOptions} radius={20}>
      <Popup>{message || "Create field location"}</Popup>
    </CircleMarker>
  );
};
