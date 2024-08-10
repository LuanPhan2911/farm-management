"use client";

import { CategoryEditDialog } from "@/app/[locale]/(backoffice)/dashboard/(catalog)/categories/_components/category-edit-button";
import { DynamicAlertDialog } from "../dynamic-alert-dialog";

export const DialogProvider = () => {
  return (
    <>
      <DynamicAlertDialog />
      <CategoryEditDialog />
    </>
  );
};
