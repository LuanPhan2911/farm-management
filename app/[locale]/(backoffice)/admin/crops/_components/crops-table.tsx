"use client";

import { NavPagination } from "@/components/nav-pagination";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFormatter, useTranslations } from "next-intl";
import { UnitWithValue } from "@/app/[locale]/(backoffice)/admin/_components/unit-with-value";
import { CropTable } from "@/types";

import { OrderByButton } from "@/components/buttons/order-by-button";
import { DatePickerWithRangeButton } from "@/components/buttons/date-picker-range-button";
import { SearchBar } from "@/components/search-bar";
import { PlantsSelect } from "@/app/[locale]/(backoffice)/admin/_components/plants-select";
import { useUpdateSearchParam } from "@/hooks/use-update-search-param";
import { useRouterWithRole } from "@/hooks/use-router-with-role";
import { FieldsSelect } from "../../_components/fields-select";
import { SelectItemContentWithoutImage } from "@/components/form/select-item";

interface CropsTableProps {
  data: CropTable[];
  totalPage: number;
}
export const CropsTable = ({ data, totalPage }: CropsTableProps) => {
  const t = useTranslations("crops");
  const { dateTime } = useFormatter();
  const { updateSearchParam: updatePlantId, initialParam: plantId } =
    useUpdateSearchParam("plantId");
  const { updateSearchParam: updateFieldId, initialParam: fieldId } =
    useUpdateSearchParam("fieldId");
  const { push } = useRouterWithRole();
  const handleEdit = (row: CropTable) => {
    push(`crops/detail/${row.id}`);
  };

  return (
    <>
      <div className="py-4 flex gap-2 lg:flex-row flex-col items-start lg:items-center ">
        <SearchBar isPagination placeholder={t("search.placeholder")} />
        <DatePickerWithRangeButton />
        <PlantsSelect
          error={t("schema.plantId.error")}
          placeholder={t("schema.plantId.placeholder")}
          notFound={t("schema.plantId.notFound")}
          onChange={updatePlantId}
          appearance={{
            button: "lg:w-[250px] w-full",
            content: "lg:w-[350px]",
          }}
          defaultValue={plantId}
        />
        <FieldsSelect
          error={t("schema.fieldId.error")}
          placeholder={t("schema.fieldId.placeholder")}
          notFound={t("schema.fieldId.notFound")}
          onChange={updateFieldId}
          appearance={{
            button: "lg:w-[250px] w-full",
            content: "lg:w-[350px]",
          }}
          defaultValue={fieldId}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <OrderByButton
                column="startDate"
                label={t("table.thead.startDate")}
                defaultValue="desc"
              />
            </TableHead>
            <TableHead>
              <OrderByButton
                column="endDate"
                label={t("table.thead.endDate")}
              />
            </TableHead>
            <TableHead className="w-[200px]">
              <OrderByButton column="name" label={t("table.thead.name")} />
            </TableHead>
            <TableHead>{t("table.thead.status")}</TableHead>
            <TableHead>{t("table.thead.plant")}</TableHead>
            <TableHead className="w-[200px]">
              {t("table.thead.field.name")}
            </TableHead>
            <TableHead className="text-right">
              {t("table.thead.field.area")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => {
            return (
              <TableRow
                key={item.id}
                className="cursor-pointer"
                onClick={() => handleEdit(item)}
              >
                <TableCell>{dateTime(item.startDate, "short")}</TableCell>
                <TableCell>
                  {item.endDate
                    ? dateTime(item.endDate, "short")
                    : t("table.trow.endDate")}
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.status || t("table.trow.status")}</TableCell>
                <TableCell>{item.plant.name}</TableCell>
                <TableCell>
                  <SelectItemContentWithoutImage
                    title={item.field.name}
                    description={item.field.location}
                  />
                </TableCell>
                <TableCell className="text-right">
                  {!!item.field.area ? (
                    <UnitWithValue
                      value={item.field.area}
                      unit={item.field.unit?.name}
                    />
                  ) : (
                    t("table.trow.field.area")
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {!data.length && (
        <div className="my-4 text-muted-foreground flex justify-center">
          No results.
        </div>
      )}
      <div className="py-4">
        <NavPagination totalPage={totalPage} />
      </div>
    </>
  );
};
