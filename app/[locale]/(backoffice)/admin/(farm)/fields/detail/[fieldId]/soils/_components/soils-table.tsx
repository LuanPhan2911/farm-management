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
import { SoilCreateButton, SoilCreateManyButton } from "./soil-create-button";
import { UnitWithValue } from "@/app/[locale]/(backoffice)/admin/_components/unit-with-value";
import { SoilTable } from "@/types";
import { SoilsTableAction } from "./soils-table-action";
import {
  SoilConfirmButton,
  SoilsConfirmedAllButton,
} from "./soil-confirm-button";

import { OrderByButton } from "@/components/buttons/order-by-button";
import { DatePickerWithRangeButton } from "@/components/buttons/date-picker-range-button";
import { SoilsTableFaceted } from "./soils-table-faceted";
import { SelectItemContent } from "@/components/form/select-item";
import { SoilPinnedButton } from "./soil-pinned-button";
import { cn } from "@/lib/utils";
import { useDialog } from "@/stores/use-dialog";
import { SoilsExportButton } from "./soils-export-button";
import { SoilDeleteManyUnConfirmedButton } from "./soil-delete-button";

interface SoilsTableProps {
  data: SoilTable[];
  totalPage: number;
}
export const SoilsTable = ({ data, totalPage }: SoilsTableProps) => {
  const t = useTranslations("soils.table");
  const { dateTime, relativeTime } = useFormatter();
  const { onOpen } = useDialog();
  const handleEdit = (data: SoilTable) => {
    onOpen("soil.edit", { soil: data });
  };
  return (
    <div className="flex flex-col gap-y-2 p-4 border rounded-lg my-4">
      <div className="flex lg:justify-end gap-1.5 flex-wrap">
        <SoilCreateManyButton />
        <SoilsExportButton />
        <SoilCreateButton />
        <SoilsConfirmedAllButton />
        <SoilDeleteManyUnConfirmedButton />
      </div>
      <DatePickerWithRangeButton />
      <SoilsTableFaceted />
      {!data.length ? (
        <div className="my-4 text-muted-foreground text-center">
          No results.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>
                <OrderByButton
                  column="createdAt"
                  label={t("thead.createdAt")}
                  defaultValue="desc"
                />
              </TableHead>
              <TableHead>
                <OrderByButton column="ph" label={t("thead.ph")} />
              </TableHead>

              <TableHead>
                <OrderByButton
                  column="nutrientNitrogen"
                  label={t("thead.nutrientNitrogen")}
                />
              </TableHead>
              <TableHead>
                <OrderByButton
                  column="nutrientPhosphorus"
                  label={t("thead.nutrientPhosphorus")}
                />
              </TableHead>
              <TableHead>
                <OrderByButton
                  column="nutrientPotassium"
                  label={t("thead.nutrientPotassium")}
                />
              </TableHead>
              <TableHead>
                <OrderByButton
                  column="moisture.value"
                  label={t("thead.moisture")}
                />
              </TableHead>
              <TableHead>{t("thead.confirmed")} </TableHead>
              <TableHead>{t("thead.confirmedAt")} </TableHead>
              <TableHead className="min-w-[200px]">
                {t("thead.confirmedBy")}{" "}
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => {
              return (
                <TableRow
                  key={item.id}
                  className="cursor-pointer group"
                  onClick={() => handleEdit(item)}
                >
                  <TableCell>
                    <SoilPinnedButton
                      data={item}
                      className={cn(
                        !item.pinned && "opacity-0 group-hover:opacity-100"
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    {dateTime(item.createdAt, {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-center">{item.ph}</TableCell>

                  <TableCell className="text-center">
                    <UnitWithValue
                      value={item.nutrientNitrogen}
                      unit={item.nutrientUnit?.name}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <UnitWithValue
                      value={item.nutrientPhosphorus}
                      unit={item.nutrientUnit?.name}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <UnitWithValue
                      value={item.nutrientPotassium}
                      unit={item.nutrientUnit?.name}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <UnitWithValue
                      value={item.moisture?.value}
                      unit={item.moisture?.unit?.name}
                    />
                  </TableCell>

                  <TableCell>
                    <SoilConfirmButton data={item} />
                  </TableCell>
                  <TableCell>
                    {item.confirmedAt
                      ? relativeTime(item.confirmedAt)
                      : t("trow.confirmedAt")}
                  </TableCell>
                  <TableCell>
                    {item.confirmedBy ? (
                      <SelectItemContent
                        imageUrl={item.confirmedBy.imageUrl}
                        title={item.confirmedBy.name}
                      />
                    ) : (
                      t("trow.confirmedBy")
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
      )}
      <div className="py-4">
        <NavPagination totalPage={totalPage} />
      </div>
    </div>
  );
};
