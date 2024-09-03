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
interface UnitSuperscriptWithValueProps {
  value: number | null | undefined | string;
  unit?: string;
}
export const UnitSuperscriptWithValue = ({
  unit,
  value,
}: UnitSuperscriptWithValueProps) => {
  if (!unit) {
    return null;
  }
  const [baseUnit, exponent] = splitUnitValue(unit);
  if (!exponent) {
    return (
      <span>
        {value}
        {baseUnit}
      </span>
    );
  }

  return (
    <span>
      {value}
      {baseUnit}
      <sup>{exponent}</sup>
    </span>
  );
};
