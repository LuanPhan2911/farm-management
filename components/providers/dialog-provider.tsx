"use client";

import { CategoryEditDialog } from "@/app/[locale]/(backoffice)/admin/(catalog)/categories/_components/category-edit-button";
import { DynamicAlertDialog } from "@/components/dynamic-alert-dialog";
import { UnitEditDialog } from "@/app/[locale]/(backoffice)/admin/(catalog)/units/_components/unit-edit-button";
import { UnsavedChangesDialog } from "@/components/unsaved-changes-dialog";
import { ApplicantSetRoleDialog } from "@/app/[locale]/(backoffice)/admin/(recruit)/applicants/_components/applicant-set-role-button";

export const DialogProvider = () => {
  return (
    <>
      <UnsavedChangesDialog />
      <DynamicAlertDialog />
      <ApplicantSetRoleDialog />
      <CategoryEditDialog />
      <UnitEditDialog />
    </>
  );
};
