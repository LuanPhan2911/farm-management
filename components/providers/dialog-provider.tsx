"use client";

import { CategoryEditDialog } from "@/app/[locale]/(backoffice)/admin/(catalog)/categories/_components/category-edit-button";
import { DynamicAlertDialog } from "@/components/dialog/dynamic-alert-dialog";
import { UnitEditDialog } from "@/app/[locale]/(backoffice)/admin/(catalog)/units/_components/unit-edit-button";
import { UnsavedChangesDialog } from "@/components/dialog/unsaved-changes-dialog";
import { StaffCreateDialog } from "@/app/[locale]/(backoffice)/admin/(account)/staffs/_components/staff-create-button";
import { ApplicantStaffCreateDialog } from "@/app/[locale]/(backoffice)/admin/(recruit)/applicants/_components/applicant-staff-create-button";
import { StaffEditRoleDialog } from "@/app/[locale]/(backoffice)/admin/(account)/staffs/_components/staff-edit-role";
import { WeatherEditDialog } from "@/app/[locale]/(backoffice)/admin/(farm)/fields/detail/[fieldId]/weathers/_components/weather-edit-button";
import { SoilEditDialog } from "@/app/[locale]/(backoffice)/admin/(farm)/fields/detail/[fieldId]/soils/_components/soil-edit-button";

export const DialogProvider = () => {
  return (
    <>
      <UnsavedChangesDialog />
      <DynamicAlertDialog />
      <StaffEditRoleDialog />
      <CategoryEditDialog />
      <UnitEditDialog />
      <StaffCreateDialog />
      <ApplicantStaffCreateDialog />
      <WeatherEditDialog />
      <SoilEditDialog />
    </>
  );
};
