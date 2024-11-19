"use client";

import {
  ComboBoxCustomAppearance,
  ComboBoxDefault,
} from "@/components/form/combo-box";
import { MaterialType } from "@prisma/client";
import { FertilizersSelect } from "./fertilizers-select";
import { PesticidesSelect } from "./pesticides-select";
import { CategoriesSelect } from "./categories-select";

type MaterialSelected = {
  label: string;
  value: string;
};
interface MaterialNameSelectProps {
  type: MaterialType;
  onChange: (value: string | undefined) => void;
  defaultValue?: string;
  disabled?: boolean;
  placeholder: string;
  notFound: string;
  error: string;
  appearance?: ComboBoxCustomAppearance;
  onSelected?: (value: MaterialSelected) => void;
}
export const MaterialNameSelect = (props: MaterialNameSelectProps) => {
  if (props.type === "FERTILIZER") {
    return (
      <FertilizersSelect
        {...props}
        onSelected={(selected) => {
          props.onSelected?.({
            label: selected.name,
            value: selected.id,
          });
        }}
      />
    );
  }
  if (props.type === "PESTICIDE") {
    return (
      <PesticidesSelect
        {...props}
        onSelected={(selected) => {
          props.onSelected?.({
            label: selected.name,
            value: selected.id,
          });
        }}
      />
    );
  }
  if (props.type === "SEED") {
    return (
      <CategoriesSelect
        {...props}
        type="SEED"
        valueKey="name"
        defaultValue={undefined}
      />
    );
  }
  return (
    <ComboBoxDefault
      options={[]}
      notFound={props.notFound}
      onChange={props.onChange}
      placeholder={props.placeholder}
      disabled={props.disabled}
      appearance={props.appearance}
    />
  );
};
