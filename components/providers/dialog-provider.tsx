"use client";

import { EditCategoryDialog } from "@/app/[locale]/(backoffice)/dashboard/(catalog)/categories/_components/edit-category-button";
import { DynamicAlertDialog } from "../dynamic-alert-dialog";

export const DialogProvider = () => {
  return (
    <>
      <DynamicAlertDialog />
      <EditCategoryDialog />
    </>
  );
};
