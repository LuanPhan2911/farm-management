"use client";

import { splitUnitValue } from "@/lib/utils";

interface UnitSuperscriptProps {
  unit: string;
}
export const UnitSuperscript = ({ unit }: UnitSuperscriptProps) => {
  const [baseUnit, exponent] = splitUnitValue(unit);
  if (!exponent) {
    return <span>{baseUnit}</span>;
  }

  return (
    <span>
      {baseUnit}
      <sup>{exponent}</sup>
    </span>
  );
};
interface UnitWithValueProps {
  value: number | null | undefined | string;
  unit?: string;
}
export const UnitWithValue = ({ unit, value }: UnitWithValueProps) => {
  return (
    <p className="text-right">
      {value} {unit || ""}
    </p>
  );
};
