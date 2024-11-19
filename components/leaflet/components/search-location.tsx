"use client";
import { ComboBoxDefault } from "@/components/form/combo-box";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useLocationSelect } from "@/hooks/use-location-select";
import { getLatLng } from "@/lib/utils";
import { LocationSelectSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { LatLngTuple } from "leaflet";
import { useTranslations } from "next-intl";
import { memo, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface SearchLocationProps {
  goToLocationFn: (value: LatLngTuple, zoom?: number) => void;
  onChangeLocationSelectFn?: (value: string) => void;
}
export const SearchLocation = ({
  goToLocationFn,
  onChangeLocationSelectFn,
}: SearchLocationProps) => {
  const tSchema = useTranslations("fields.schema.locations");
  const formSchema = LocationSelectSchema(tSchema);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const selectedCityId = form.watch("city");
  const selectedDistrictId = form.watch("district");
  const selectedTownId = form.watch("town");

  const { cityData, districtData, townData } = useLocationSelect({
    selectedCityId,
    selectedDistrictId,
  });

  const selectedTown = useMemo(() => {
    return townData.find((item) => item.level3_id === selectedTownId);
  }, [selectedTownId, townData]);

  const selectedDistrict = useMemo(() => {
    return districtData.find((item) => item.level2_id === selectedDistrictId);
  }, [selectedDistrictId, districtData]);
  const selectedCity = useMemo(() => {
    return cityData.find((item) => item.level1_id === selectedCityId);
  }, [selectedCityId, cityData]);

  useEffect(() => {
    form.setValue("town", undefined);
  }, [selectedDistrict, form]);
  useEffect(() => {
    form.setValue("district", undefined);
    form.setValue("town", undefined);
  }, [form, selectedCityId]);

  useEffect(() => {
    if (selectedTown) {
      onChangeLocationSelectFn?.(
        [selectedCity?.name, selectedDistrict?.name, selectedTown.name]
          .filter((item) => item !== undefined)
          .join(" - ")
      );
      if (selectedTown.latitude === null || selectedTown.longitude === null) {
        toast.error(tSchema("errors.nullLatlng"));
        return;
      }
      goToLocationFn(getLatLng(selectedTown.latitude, selectedTown.longitude));
      return;
    }

    if (selectedDistrict) {
      onChangeLocationSelectFn?.(
        [selectedCity?.name, selectedDistrict?.name]
          .filter((item) => item !== undefined)
          .join(" - ")
      );
      if (
        selectedDistrict.latitude === null ||
        selectedDistrict.longitude === null
      ) {
        toast.error(tSchema("errors.nullLatlng"));
        return;
      }
      goToLocationFn(
        getLatLng(selectedDistrict.latitude, selectedDistrict.longitude)
      );
      return;
    }

    if (selectedCity) {
      onChangeLocationSelectFn?.(
        [selectedCity?.name].filter((item) => item !== undefined).join(" - ")
      );
      goToLocationFn(getLatLng(selectedCity.latitude, selectedCity.longitude));
      return;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCityId, selectedDistrictId, selectedTownId]);
  return (
    <Form {...form}>
      <form className="lg:flex items-center hidden">
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ComboBoxDefault
                  notFound={tSchema("city.notFound")}
                  onChange={field.onChange}
                  defaultValue={field.value ?? undefined}
                  options={cityData.map((item) => {
                    return {
                      label: item.name,
                      value: item.level1_id,
                    };
                  })}
                  placeholder={tSchema("city.placeholder")}
                  appearance={{
                    button: "lg:w-[200px] h-10",
                    content: "lg:w-[230px] z-[1000]",
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="district"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ComboBoxDefault
                  notFound={tSchema("district.notFound")}
                  onChange={field.onChange}
                  defaultValue={field.value ?? undefined}
                  options={districtData.map((item) => {
                    return {
                      label: item.name,
                      value: item.level2_id,
                    };
                  })}
                  placeholder={tSchema("district.placeholder")}
                  appearance={{
                    button: "lg:w-[200px] h-10",
                    content: "lg:w-[230px] z-[1000]",
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="town"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ComboBoxDefault
                  notFound={tSchema("town.notFound")}
                  onChange={field.onChange}
                  defaultValue={field.value ?? undefined}
                  options={townData.map((item) => {
                    return {
                      label: item.name,
                      value: item.level3_id,
                    };
                  })}
                  placeholder={tSchema("town.placeholder")}
                  appearance={{
                    button: "lg:w-[200px] h-10",
                    content: "lg:w-[230px] z-[1000]",
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export const SearchLocationMemo = memo(SearchLocation);
