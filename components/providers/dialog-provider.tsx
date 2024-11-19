"use client";

import { CategoryEditDialog } from "@/app/[locale]/(backoffice)/admin/(catalog)/categories/_components/category-edit-button";
import { DynamicAlertDialog } from "@/components/dialog/dynamic-alert-dialog";
import { UnitEditDialog } from "@/app/[locale]/(backoffice)/admin/(catalog)/units/_components/unit-edit-button";
import { ApplicantStaffCreateDialog } from "@/app/[locale]/(backoffice)/admin/(recruit)/applicants/_components/applicant-staff-create-button";
import { WeatherEditDialog } from "@/app/[locale]/(backoffice)/admin/(farm)/fields/detail/[fieldId]/weathers/_components/weather-edit-button";
import { SoilEditDialog } from "@/app/[locale]/(backoffice)/admin/(farm)/fields/detail/[fieldId]/soils/_components/soil-edit-button";
import { FertilizerEditDialog } from "@/app/[locale]/(backoffice)/admin/(farm)/fertilizers/_components/fertilizer-edit-button";
import { PesticideEditDialog } from "@/app/[locale]/(backoffice)/admin/(farm)/pesticides/_components/pesticide-edit-button";
import { FileEditNameDialog } from "@/app/[locale]/(backoffice)/admin/(files)/_components/file-edit-name-button";
import { PlantFertilizerEditDialog } from "@/app/[locale]/(backoffice)/admin/(farm)/plants/detail/[plantId]/fertilizers/_components/plant-fertilizers-edit-button";
import { PlantPesticideEditDialog } from "@/app/[locale]/(backoffice)/admin/(farm)/plants/detail/[plantId]/pesticides/_components/plant-pesticides-edit-button";
import { EquipmentDetailEditDialog } from "@/app/[locale]/(backoffice)/admin/(inventory)/equipments/detail/[equipmentId]/_components/equipment-detail-edit-button";
import { MaterialUsageEditDialog } from "@/app/[locale]/(backoffice)/admin/(inventory)/materials/detail/[materialId]/usages/_components/material-usages-edit-button";
import { EquipmentUsageEditDialog } from "@/app/[locale]/(backoffice)/admin/(inventory)/equipments/detail/[equipmentId]/details/[equipmentDetailId]/usages/_components/equipment-usage-edit-button";
import { StaffEditDialog } from "@/app/[locale]/(backoffice)/admin/(account)/staffs/_components/staff-edit-button";
import { ActivityStaffEditDialog } from "@/app/[locale]/(backoffice)/admin/activities/detail/[activityId]/staffs/_components/activity-staffs-edit-button";
import { DynamicDialogOTP } from "../dialog/dynamic-dialog-confirm";

export const DialogProvider = () => {
  return (
    <>
      <DynamicAlertDialog />
      <CategoryEditDialog />
      <UnitEditDialog />
      <StaffEditDialog />
      <ApplicantStaffCreateDialog />
      <WeatherEditDialog />
      <SoilEditDialog />
      <FertilizerEditDialog />
      <PesticideEditDialog />
      <FileEditNameDialog />
      <PlantFertilizerEditDialog />
      <PlantPesticideEditDialog />
      <EquipmentDetailEditDialog />
      <MaterialUsageEditDialog />
      <EquipmentUsageEditDialog />
      <ActivityStaffEditDialog />

      <DynamicDialogOTP />
    </>
  );
};
