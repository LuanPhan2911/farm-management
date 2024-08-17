"use client";

import { CategoryEditDialog } from "@/app/[locale]/(backoffice)/admin/(catalog)/categories/_components/category-edit-button";
import { DynamicAlertDialog } from "@/components/dynamic-alert-dialog";
import { UnitEditDialog } from "@/app/[locale]/(backoffice)/admin/(catalog)/units/_components/unit-edit-button";
import { UnsavedChangesDialog } from "@/components/unsaved-changes-dialog";

export const DialogProvider = () => {
  return (
    <>
      <UnsavedChangesDialog />
      <DynamicAlertDialog />
      <CategoryEditDialog />
      <UnitEditDialog />
    </>
  );
};
