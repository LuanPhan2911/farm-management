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
import { CropCreateButton } from "./crop-create-button";
import { UnitWithValue } from "@/app/[locale]/(backoffice)/admin/_components/unit-with-value";
import { CropTable } from "@/types";
import { CropsTableAction } from "./crops-table-action";

import { OrderByButton } from "@/components/buttons/order-by-button";
import { DatePickerWithRangeButton } from "@/components/buttons/date-picker-range-button";
import { SearchBar } from "@/components/search-bar";
import { useSearchParams } from "next/navigation";
import { parseToDate } from "@/lib/utils";
import { PlantsSelectWithQueryClient } from "@/app/[locale]/(backoffice)/admin/_components/plants-select";
import { useUpdateSearchParam } from "@/hooks/use-update-search-param";
import { Button } from "@/components/ui/button";

interface CropsTableProps {
  data: CropTable[];
  totalPage: number;
}
export const CropsTable = ({ data, totalPage }: CropsTableProps) => {
  const t = useTranslations("crops");
  const { dateTime } = useFormatter();
  const searchParams = useSearchParams();
  const { updateSearchParam } = useUpdateSearchParam("plantId");
  const startDate = parseToDate(searchParams.get("begin"));
  const endDate = parseToDate(searchParams.get("end"));
  const plantId = searchParams.get("plantId") || undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("page.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end">
          <CropCreateButton />
        </div>
        <div className="py-4 flex gap-2 lg:flex-row flex-col items-start lg:items-center">
          <SearchBar isPagination placeholder={t("search.placeholder")} />
          <DatePickerWithRangeButton from={startDate} to={endDate} />
          <div className="lg:w-[300px] w-full flex gap-x-2 items-center">
            <PlantsSelectWithQueryClient
              errorLabel={t("schema.plantId.error")}
              label={t("schema.plantId.placeholder")}
              notFound={t("schema.plantId.notFound")}
              onChange={updateSearchParam}
              defaultValue={plantId}
            />
            {!!plantId && (
              <Button size={"sm"} onClick={() => updateSearchParam(undefined)}>
                Clear
              </Button>
            )}
          </div>
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
                <TableRow key={item.id} className="cursor-pointer">
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
                        unit={item.estimatedYield.unit.name}
                      />
                    ) : (
                      t("table.trow.actualYield")
                    )}
                  </TableCell>
                  <TableCell>
                    {!!item.actualYield ? (
                      <UnitWithValue
                        value={item.actualYield.value}
                        unit={item.actualYield.unit.name}
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
        <div className="py-4">
          <NavPagination totalPage={totalPage} />
        </div>
      </CardContent>
    </Card>
  );
};
