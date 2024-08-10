"use client";

import { CategoryEditDialog } from "@/app/[locale]/(backoffice)/dashboard/(catalog)/categories/_components/category-edit-button";
import { DynamicAlertDialog } from "../dynamic-alert-dialog";
import { UnitEditDialog } from "@/app/[locale]/(backoffice)/dashboard/(catalog)/units/_components/unit-edit-button";

export const DialogProvider = () => {
  return (
    <>
      <DynamicAlertDialog />
      <CategoryEditDialog />
      <UnitEditDialog />
    </>
  );
};
