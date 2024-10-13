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
import { CropsTableAction } from "./crops-table-action";

import { OrderByButton } from "@/components/buttons/order-by-button";
import { DatePickerWithRangeButton } from "@/components/buttons/date-picker-range-button";
import { SearchBar } from "@/components/search-bar";
import { PlantsSelect } from "@/app/[locale]/(backoffice)/admin/_components/plants-select";
import { useUpdateSearchParam } from "@/hooks/use-update-search-param";
import { useDialog } from "@/stores/use-dialog";

interface CropsTableProps {
  data: CropTable[];
  totalPage: number;
}
export const CropsTable = ({ data, totalPage }: CropsTableProps) => {
  const t = useTranslations("crops");
  const { dateTime } = useFormatter();
  const { updateSearchParam, initialParam: plantId } =
    useUpdateSearchParam("plantId");
  const { onOpen } = useDialog();
  const handleEdit = (row: CropTable) => {
    onOpen("crop.edit", {
      crop: row,
    });
  };

  return (
    <>
      <div className="py-4 flex gap-2 lg:flex-row flex-col items-start lg:items-center ">
        <SearchBar isPagination placeholder={t("search.placeholder")} />
        <DatePickerWithRangeButton />
        <PlantsSelect
          errorLabel={t("schema.plantId.error")}
          label={t("schema.plantId.placeholder")}
          notFound={t("schema.plantId.notFound")}
          onChange={updateSearchParam}
          appearance={{
            button: "lg:w-[250px] w-full",
            content: "lg:w-[250px]",
          }}
          defaultValue={plantId}
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
            <TableHead>
              <OrderByButton column="name" label={t("table.thead.name")} />
            </TableHead>
            <TableHead>{t("table.thead.plant")}</TableHead>
            <TableHead>
              <OrderByButton
                column="estimatedYield.value"
                label={t("table.thead.estimatedYield")}
              />
            </TableHead>
            <TableHead>
              <OrderByButton
                column="actualYield.value"
                label={t("table.thead.actualYield")}
              />
            </TableHead>
            <TableHead>{t("table.thead.status")}</TableHead>
            <TableHead></TableHead>
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
                <TableCell>{dateTime(item.startDate)}</TableCell>
                <TableCell>
                  {item.endDate
                    ? dateTime(item.endDate)
                    : t("table.trow.endDate")}
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.plant.name}</TableCell>
                <TableCell>
                  {!!item.estimatedYield ? (
                    <UnitWithValue
                      value={item.estimatedYield.value}
                      unit={item.estimatedYield.unit?.name}
                    />
                  ) : (
                    t("table.trow.actualYield")
                  )}
                </TableCell>
                <TableCell>
                  {!!item.actualYield ? (
                    <UnitWithValue
                      value={item.actualYield.value}
                      unit={item.actualYield.unit?.name}
                    />
                  ) : (
                    t("table.trow.actualYield")
                  )}
                </TableCell>
                <TableCell>{item.status || t("table.trow.status")}</TableCell>
                <TableCell>
                  <CropsTableAction data={item} />
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
