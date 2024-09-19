"use client";

import { NavPagination } from "@/components/nav-pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFormatter, useTranslations } from "next-intl";
import { SoilCreateButton } from "./soil-create-button";
import { UnitWithValue } from "@/app/[locale]/(backoffice)/admin/_components/unit-with-value";
import { SoilTable } from "@/types";
import { SoilsTableAction } from "./soils-table-action";
import { SoilConfirmButton } from "./soil-confirm-button";

import { OrderByButton } from "@/components/buttons/order-by-button";
import { DatePickerWithRangeButton } from "@/components/buttons/date-picker-range-button";
import { SoilsTableFaceted } from "./soils-table-faceted";
import { SelectItemContent } from "@/components/form/select-item";

interface SoilsTableProps {
  data: SoilTable[];
  totalPage: number;
}
export const SoilsTable = ({ data, totalPage }: SoilsTableProps) => {
  const t = useTranslations("soils");
  const { dateTime, relativeTime } = useFormatter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("page.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end">
          <SoilCreateButton />
        </div>
        <DatePickerWithRangeButton from={undefined} />
        <SoilsTableFaceted />

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <OrderByButton
                  column="createdAt"
                  label={t("table.thead.createdAt")}
                  defaultValue="desc"
                />
              </TableHead>

              <TableHead>
                <OrderByButton
                  column="nutrientNitrogen"
                  label={t("table.thead.nutrientNitrogen")}
                />
              </TableHead>
              <TableHead>
                <OrderByButton
                  column="nutrientPhosphorus"
                  label={t("table.thead.nutrientPhosphorus")}
                />
              </TableHead>
              <TableHead>
                <OrderByButton
                  column="nutrientPotassium"
                  label={t("table.thead.nutrientPotassium")}
                />
              </TableHead>
              <TableHead>
                <OrderByButton
                  column="moisture.value"
                  label={t("table.thead.moisture")}
                />
              </TableHead>
              <TableHead>{t("table.thead.confirmed")} </TableHead>
              <TableHead>{t("table.thead.confirmedAt")} </TableHead>
              <TableHead>{t("table.thead.confirmedBy")} </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => {
              return (
                <TableRow key={item.id} className="cursor-pointer">
                  <TableCell>
                    {dateTime(item.createdAt, {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </TableCell>

                  <TableCell>
                    <UnitWithValue
                      value={item.nutrientNitrogen}
                      unit={item.nutrientUnit.name}
                    />
                  </TableCell>
                  <TableCell>
                    <UnitWithValue
                      value={item.nutrientPhosphorus}
                      unit={item.nutrientUnit.name}
                    />
                  </TableCell>
                  <TableCell>
                    <UnitWithValue
                      value={item.nutrientPotassium}
                      unit={item.nutrientUnit.name}
                    />
                  </TableCell>
                  <TableCell>
                    <UnitWithValue
                      value={item.moisture.value}
                      unit={item.moisture.unit.name}
                    />
                  </TableCell>

                  <TableCell>
                    <SoilConfirmButton
                      confirmed={item.confirmed}
                      soilId={item.id}
                    />
                  </TableCell>
                  <TableCell>
                    {item.confirmedAt
                      ? relativeTime(item.confirmedAt)
                      : t("table.trow.confirmedAt")}
                  </TableCell>
                  <TableCell>
                    {item.confirmedBy ? (
                      <SelectItemContent
                        imageUrl={item.confirmedBy.imageUrl}
                        title={item.confirmedBy.name}
                      />
                    ) : (
                      t("table.trow.confirmedBy")
                    )}
                  </TableCell>
                  <TableCell>
                    <SoilsTableAction data={item} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div className="py-4">
          <NavPagination totalPage={totalPage} />
        </div>
      </CardContent>
    </Card>
  );
};
