"use client";

import {
  FertilizerFrequencyValue,
  FertilizerTypeValue,
} from "@/app/[locale]/(backoffice)/admin/(farm)/fertilizers/_components/fertilizer-status-value";
import {
  PesticideToxicLevelValue,
  PesticideTypeValue,
} from "@/app/[locale]/(backoffice)/admin/(farm)/pesticides/_components/pesticide-status-value";
import { UnitWithValue } from "@/app/[locale]/(backoffice)/admin/_components/unit-with-value";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FertilizerTable, PesticideTable } from "@/types";
import { useTranslations } from "next-intl";

interface ProductMaterialUsageTableProps {
  fertilizers: FertilizerTable[];
  pesticides: PesticideTable[];
}
export const ProductMaterialUsageTable = ({
  fertilizers,
  pesticides,
}: ProductMaterialUsageTableProps) => {
  return (
    <>
      <Card
        className="border-border/40 bg-background/95 
    backdrop-blur supports-[backdrop-filter]:bg-background/40 shadow-md"
      >
        <CardHeader>
          <CardTitle className="text-green-400">Phân bón</CardTitle>
          <CardDescription className="dark:text-white">
            Danh sách phân bón đã sử dụng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FertilizersTable data={fertilizers} />
        </CardContent>
      </Card>
      <Card
        className="border-border/40 bg-background/95 
    backdrop-blur supports-[backdrop-filter]:bg-background/40 shadow-md"
      >
        <CardHeader>
          <CardTitle className="text-green-400">
            Thuốc bảo vệ thực vật
          </CardTitle>
          <CardDescription className="dark:text-white">
            Danh sách thuốc bảo vệ thực vật sử dụng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PesticidesTable data={pesticides} />
        </CardContent>
      </Card>
    </>
  );
};

interface PesticidesTableProps {
  data: PesticideTable[];
}
const PesticidesTable = ({ data }: PesticidesTableProps) => {
  const t = useTranslations("pesticides");
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px]">
              {t("table.thead.name")}
            </TableHead>
            <TableHead>{t("table.thead.type")}</TableHead>
            <TableHead>{t("table.thead.toxicityLevel")}</TableHead>
            <TableHead>{t("table.thead.applicationMethod")}</TableHead>
            <TableHead>{t("table.thead.manufacturer")}</TableHead>
            <TableHead className="text-right">
              {t("table.thead.recommendedDosage")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => {
            return (
              <TableRow key={item.id} className="cursor-pointer">
                <TableHead>{item.name}</TableHead>
                <TableCell>
                  <PesticideTypeValue value={item.type || undefined} />
                </TableCell>
                <TableCell>
                  <PesticideToxicLevelValue
                    value={item.toxicityLevel || undefined}
                  />
                </TableCell>
                <TableCell>
                  {item.applicationMethod || t("table.trow.applicationMethod")}
                </TableCell>
                <TableCell>
                  {item.manufacturer || t("table.trow.manufacturer")}
                </TableCell>
                <TableCell className="text-right">
                  {item.recommendedDosage?.value ? (
                    <UnitWithValue
                      value={item.recommendedDosage.value}
                      unit={item.recommendedDosage.unit?.name}
                    />
                  ) : (
                    t("table.trow.recommendedDosage")
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
    </>
  );
};

interface FertilizersTableProps {
  data: FertilizerTable[];
}
const FertilizersTable = ({ data }: FertilizersTableProps) => {
  const t = useTranslations("fertilizers");
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px]">
              {t("table.thead.name")}
            </TableHead>
            <TableHead>{t("table.thead.type")}</TableHead>
            <TableHead>{t("table.thead.frequencyOfUse")}</TableHead>
            <TableHead>{t("table.thead.nutrientOfNPK")}</TableHead>
            <TableHead>{t("table.thead.applicationMethod")}</TableHead>
            <TableHead>{t("table.thead.manufacturer")}</TableHead>
            <TableHead className="text-right">
              {t("table.thead.recommendedDosage")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => {
            return (
              <TableRow key={item.id} className="cursor-pointer">
                <TableHead>{item.name}</TableHead>
                <TableCell>
                  <FertilizerTypeValue value={item.type || undefined} />
                </TableCell>
                <TableCell>
                  <FertilizerFrequencyValue
                    value={item.frequencyOfUse || undefined}
                  />
                </TableCell>
                <TableCell>
                  {item.nutrientOfNPK || t("table.trow.nutrientOfNPK")}
                </TableCell>

                <TableCell>
                  {item.applicationMethod || t("table.trow.applicationMethod")}
                </TableCell>
                <TableCell>
                  {item.manufacturer || t("table.trow.manufacturer")}
                </TableCell>
                <TableCell className="text-right">
                  {item.recommendedDosage?.value ? (
                    <UnitWithValue
                      value={item.recommendedDosage.value}
                      unit={item.recommendedDosage.unit?.name}
                    />
                  ) : (
                    t("table.trow.recommendedDosage")
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
    </>
  );
};
